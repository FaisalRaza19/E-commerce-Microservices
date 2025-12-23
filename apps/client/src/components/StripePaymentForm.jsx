"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import useCartStore from "@/stores/cartStore";
import { useAuth, useUser } from "@clerk/nextjs";

// Make sure your Publishable Key is correct
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51QHMTbJkrqo5V2TDRkvZOCFqcvUegKk1XaCPTgdoXb15obcwMZvRNdVInsaVck1mD0GraDk3ap2P9VeP3BF60Fvd007dPylIbp"
);

const StripePaymentForm = () => {
  const { cart } = useCartStore();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const createCheckoutSession = async () => {
      try {
        setLoading(true);
        const token = await getToken();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ cart }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || "Server Error");
        }

        if (data.checkoutSessionClientSecret) {
          setClientSecret(data.checkoutSessionClientSecret);
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    createCheckoutSession();
  }, [cart, getToken, isLoaded, isSignedIn, user]);

  if (loading) {
    return <div className="p-4 text-center">Loading payment secure form...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!clientSecret) {
    return <div>Could not initialize payment.</div>;
  }

  return (
    <div className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default StripePaymentForm;