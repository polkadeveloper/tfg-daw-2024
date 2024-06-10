import { type APIContext } from "astro";
import Stripe from "stripe";
const stripe = new Stripe(import.meta.env.STRIPE_PRIVATE_API_KEY);

export async function POST(context: APIContext) {
  // Parsea el cuerpo de la solicitud a JSON
  const body = await context.request.text();
  const { cartItems } = JSON.parse(body);

  // Transforma los cartItems para que se ajusten al formato de Stripe
  const line_items = Object.values(cartItems).map((item: any) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: `${item.name} - ${item.size}`,
        images: [item.imageSrc],
      },
      unit_amount: parseFloat(item.price) * 100, // Stripe espera el precio en centavos
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode: "payment",
    allow_promotion_codes: true,
    currency: "eur",
    automatic_tax: { enabled: true },
    return_url: `http://localhost:4321/return?session_id={CHECKOUT_SESSION_ID}`,
    redirect_on_completion: "always",
    line_items,
    billing_address_collection: "required",
    payment_method_types: ["card", "paypal"],
    phone_number_collection: {
      enabled: true,
    },
    after_expiration: {
      recovery: {
        enabled: true,
        allow_promotion_codes: true,
      },
    },
  });

  // Devuelve el ID de la sesión en la respuesta
  return new Response(JSON.stringify({ id: session.client_secret }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
