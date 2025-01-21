import { getSession } from "@auth0/nextjs-auth0";
import stripeInit from "stripe";

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { user } = await getSession(req, res);

  const lineItems = [
    {
      price: process.env.STRIPE_PRICE_ID,
      quantity: 1,
    },
  ];

  const protocol =
    process.env.NODE_ENV === "production" ? "https://" : "http://";
  const host = req.headers.host;

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${protocol}${host}/success`,
    payment_intent_data: {
      metadata: {
        userId: user.sub,
      },
    },
  });

  res.status(200).json({ session: checkoutSession });
}
