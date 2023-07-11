'use client'
// import { env } from '@/app/env.mjs';
import { Database } from '@/supabase/types_db';
import { postData } from '@/utils/helpers';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Prices from './Prices';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  session: Session | null;
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

export default function Products({
  session,
  user,
  products,
  subscription,
}: Props) {

  const checkoutLinks = JSON.parse(process.env.LEMON_SQUEEZY_CHECKOUT_LINKS || null)

  if (!products.length)
    return (
      <section className="">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found.
          </p>
        </div>
      </section>
    );

  return (
    <section className="">
      <div className="max-w-6xl px-4  mx-auto pt-6  md:pt-16 lg:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center sm:justify-center">
          <h1 className="text-4xl font-extrabold text-white text-center sm:text-6xl">
            Pricing Plans
          </h1>
          {/* <div className="relative flex self-center mt-3 justify-center items-center">

            <div className="p-6 py-2 m-1 text-2xl font-medium text-white rounded-md shadow-sm border-zinc-800 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8">
              {products[0]?.name}
            </div>

          </div> */}
          {/* <div className="relative flex self-center mt-6 justify-center items-center flex-col sm:flex-row ">
            <div className='pb-10 mb-10 shadow-bottom shadow-purple-500'></div> */}
          <Box>
            <Prices product={products[0]} checkoutLinks={checkoutLinks} />
          </Box>
          {/* </div> */}
        </div>
      </div>
    </section>
  );
}


function Box({ children }) {
  return (
    <div className="w-full max-w-3xl m-auto my-8  rounded-md">


      {children}


    </div>
  );
}
