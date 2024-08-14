import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
   apiVersion: "2022-11-15",
});

export async function POST(request) {
   try {
      const { totalPrice } = await request.json();

      // Dolar işareti ve virgülleri kaldırın, ardından kuruş cinsinden bir tamsayıya dönüştürün
      const amount = parseInt(totalPrice.replace(/[$,]/g, "")) * 100;

      const paymentIntent = await stripe.paymentIntents.create({
         amount: amount, // Tamsayı olarak gönderin
         currency: "usd",
      });

      return NextResponse.json({
         clientSecret: paymentIntent.client_secret,
      });
   } catch (err) {
      console.error("Stripe PaymentIntent creation error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
   }
}
