"use client";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";
import { useState } from "react";

const CheckoutForm = ({ shippingForm }) => {
  const checkoutState = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (checkoutState.type === "success") {
        const { updateEmail, updateShippingAddress, confirm } = checkoutState.checkout;

        await updateEmail(shippingForm.email);

        await updateShippingAddress({
          name: "shipping_address",
          address: {
            line1: shippingForm.address,
            city: shippingForm.city,
            country: "US",
          },
        });

        // ✅ Don't provide returnUrl if already set in session creation
        await confirm();
      }
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
      <PaymentElement options={{ layout: "accordion" }} />
      <button disabled={loading} onClick={handleClick}>
        {loading ? "Loading..." : "Pay"}
      </button>
      {error && <div className="text-red-500 mt-2">{error.message}</div>}
    </form>
  );
};

export default CheckoutForm;
