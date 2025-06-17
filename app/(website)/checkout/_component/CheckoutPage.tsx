
'use client';
import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

interface CheckoutFormWrapperProps {
  userId: string;
  serviceId ?: string;
  amount: number;
  type: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function CheckoutFormWrapper({ userId, serviceId, amount,type }: CheckoutFormWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !amount) {
      setError('Missing required payment information.');
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, orderId: serviceId,price:amount, type }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create payment intent');
        }
        const data = await response.json();
        setClientSecret(data.clientSecret);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'Failed to initialize payment. Please try again.');
      }
    };

    createPaymentIntent();
  }, [userId, serviceId, amount,type]);

  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!clientSecret) return <div className="p-4">Loading payment information...</div>;

  // const appearance = { theme: 'stripe' as 'stripe' };
  const appearance = { theme: 'stripe' } as const;

  const options = { clientSecret, appearance };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm userId={userId} serviceId={serviceId ?? ''} price={amount} type={type} />
    </Elements>
  );
}