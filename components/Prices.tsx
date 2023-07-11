'use client'
import { useSupabase } from '@/components/supabase-provider';
import { Database } from '@/supabase/types_db';
import { postData } from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface CheckoutLinks {
  [key: string]: string;
};

interface Props {
  product?: ProductWithPrices,
  checkoutLinks: CheckoutLinks
}

export default function Prices({
  product,
  checkoutLinks
}: Props) {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [ourAi, setOurAi] = React.useState(true)
  const aiPrice = ourAi ? 1 : 0.5;
  const currency = [{ name: "CASH", symbol: "USD", div: 1 }, { name: "USDT", symbol: "USDT", div: 1 }, { name: "ETH", symbol: "ETH", div: 2000 }]

  const handleCheckout = async (price: Price) => {
    try {
      console.log(price);
      const res = await supabase.auth.getUser()

      if (!res.data.user) {
        router.push("/signin");
      }
      else {
        const link = `${checkoutLinks[price.id]}?checkout[email]=${res.data.user?.email}&checkout[custom][userId]=${res.data.user.id}`;
        router.push(link)
      }
    } catch (error) {
      return alert((error as Error)?.message);
    }
  };

  return currency.map((r, i) => {

    return product && <div className='mt-8'>

      <div className='pb-12 mb-10 shadow-bottom shadow-purple-500'>
        <h2 className='-mb-12 pl-4 text-2xl font-extrabold text-white sm:text-xl text-shadow shadow-purple-500' >{r.name}</h2></div>
      <div className="px-5 py-4">
        <div className="w-full flex flex-wrap gap-4"> {
          product.prices?.map((price) => {
            const mjlity = 2000
            const priceString = price.unit_amount / 100 / r.div * aiPrice
            const priceTotal = price.unit_amount * price.interval_count / 100 / r.div * aiPrice



            return (
              <div key={price.id} className="flex flex-grow p-4 shadow-allSides shadow-purple-500 rounded-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                <div className="p-6 flex flex-col w-full flex-grow">
                  <div className='w-full'>
                    <span className="text-2xl font-extrabold white">{priceString} {r.symbol}
                    </span>
                    <span className="text-base font-medium text-zinc-100">
                      /{price.interval}
                    </span>
                  </div>
                  <div className="w-full flex flex-grow mt-4 text-zinc-300">{price.description}</div>
                  <div class="flex items-center">
                    <input id="bordered-checkbox-1" type="checkbox" checked={ourAi} value="" onClick={e => setOurAi(!ourAi)} name="bordered-checkbox"
                      className="w-4 h-4" />
                    <label for="bordered-checkbox-1" class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">With Our AI</label>
                  </div>
                  <div className="w-full flex flex-grow mt-4 font-bold text-zinc-300">Total: {priceTotal} {r.symbol}</div>
                  <button
                    type="button"
                    onClick={() => handleCheckout(price)}
                    className="mt-6 w-full relative flex select-none items-center flex-wrap justify-center gap-2 px-3 py-1 outline-none focus-visible:ring-4 bg-purple-600 hover:bg-purple-700 rounded h-[36px] whitespace-nowrap text-xs transition cursor-pointer"
                  >
                    <span className="select-none font-bold" >Subscribe</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  })


}
