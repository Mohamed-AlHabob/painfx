import { loadStripe } from '@stripe/stripe-js';
import { apiSlice } from '@/redux/services/apiSlice';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createStripePaymentIntent: builder.mutation({
      query: (data) => ({
        url: 'payments/create-stripe-intent/',
        method: 'OPTIONS',
        body: data,
      }),
      async onQueryStarted({  }, { queryFulfilled }) {
        try {
          // Await the mutation response
          const { data } = await queryFulfilled;

          // Ensure the client_secret is present
          if (!data.client_secret) {
            throw new Error('Missing client_secret in response.');
          }

          // Initialize Stripe
          const stripe = await stripePromise;
          if (!stripe) {
            throw new Error('Stripe failed to initialize.');
          }

          // Confirm the payment
          const result = await stripe.confirmCardPayment(data.client_secret);
          if (result.error) {
            console.error('Payment failed:', result.error.message);
          } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
            console.log('Payment successful!');
          }
        } catch (error) {
          console.error('Payment initiation error:', error);
        }
      },
    }),
  }),
});

export const { useCreateStripePaymentIntentMutation } = paymentApiSlice;
