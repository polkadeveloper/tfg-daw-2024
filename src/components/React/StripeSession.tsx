import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLIC_API_KEY = import.meta.env.VITE_STRIPE_PUBLIC_API_KEY;

export function CheckoutStripe(props: any) {
  const [stripe, setStripe] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const fetchStripe = async () => {
      const stripeInstance = await loadStripe(STRIPE_PUBLIC_API_KEY);
      setStripe(stripeInstance);
    };

    fetchStripe();
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const cartItems = JSON.parse(
        localStorage.getItem(`cartItems-${props.userId}`) || "{}"
      );
      const response = await fetch("/api/create-stripe-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems }),
      });

      const session = await response.json();
      setClientSecret(session.id);
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const initCheckout = async () => {
      if (stripe && clientSecret) {
        const checkoutInstance = await stripe.initEmbeddedCheckout({
          async fetchClientSecret() {
            return Promise.resolve(clientSecret);
          },
        });

        checkoutInstance.mount("#checkout");
        setCheckout(checkoutInstance);
      }
    };

    initCheckout();
  }, [stripe, clientSecret]);

  return <div id="checkout" data-stripe-key={STRIPE_PUBLIC_API_KEY}></div>;
}
