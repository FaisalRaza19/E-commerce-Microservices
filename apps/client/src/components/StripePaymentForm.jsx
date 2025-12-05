"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import CheckoutForm from "./CheckoutForm.jsx";
import useCartStore from "@/stores/cartStore";
import { useAuth } from "@clerk/nextjs";

const stripePromise = loadStripe(
  "pk_test_51QHMTbJkrqo5V2TDRkvZOCFqcvUegKk1XaCPTgdoXb15obcwMZvRNdVInsaVck1mD0GraDk3ap2P9VeP3BF60Fvd007dPylIbp"
);

const StripePaymentForm = ({ shippingForm }) => {
  const { cart } = useCartStore();
  const { getToken } = useAuth();

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createCheckoutSession = async () => {
      try {
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
        if (data.checkoutSessionClientSecret) {
          setClientSecret(data.checkoutSessionClientSecret);
        } else {
          console.error("No client secret returned from server:", data);
        }
      } catch (err) {
        console.error("Error creating checkout session:", err);
      } finally {
        setLoading(false);
      }
    };

    createCheckoutSession();
  }, [cart, getToken]);

  if (loading) {
    return <div>Loading payment...</div>;
  }

  if (!clientSecret) {
    return <div>Failed to initialize payment.</div>;
  }

  return (
    <CheckoutProvider
      stripe={stripePromise}
      options={{
        clientSecret, // ✅ correct parameter
      }}
    >
      <CheckoutForm shippingForm={shippingForm} />
    </CheckoutProvider>
  );
};

export default StripePaymentForm;
