import {
  createOrGetCustomer,
  onOrderCreated,
  onSubscriptionCreated,
  onSubscriptionUpdated
} from '@/utils/supabase-admin';

import { headers } from 'next/headers';

const relevantEvents = new Set([
  'order_created',
  'order_refunded',
  'subscription_created',
  'subscription_updated',
  'subscription_cancelled',
  'subscription_resumed',
  'subscription_expired',
  'subscription_paused',
  'subscription_unpaused',
  'subscription_payment_failed',
  'subscription_payment_success',
  'subscription_payment_recovered'
]);

const sleep = (ms:number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  const data = await req.json();
  const order = data.data.attributes;
  const event = data.meta.event_name;
  let supabase_user_id = null;

  if (relevantEvents.has(event)) {
    console.log('start handle', event);

    try {
      switch (event) {
        case 'order_created':
          const supabase_user_id = await createOrGetCustomer(
            order.user_email,
            order.customer_id
          );
          await onOrderCreated(order, supabase_user_id);
          console.log('finish handle', event);
          break;

        case 'subscription_created':
          await sleep(1500);
          await onSubscriptionCreated(order, event, data.data.id);
          console.log('finish handle', event);
          break;
        case 'subscription_updated':
        case 'subscription_expired':
        case 'subscription_cancelled':
        case 'subscription_resumed':
        case 'subscription_payment_success':
        case 'subscription_payment_failed':
        case 'subscription_payment_recovered':
        case 'order_refunded':
          await sleep(3000);
          await onSubscriptionUpdated(order, event);
          console.log('finish handle', event);
          break;
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.error(error);
      return new Response('Webhook handler failed. View logs.', {
        status: 400
      });
    }
  }
  return new Response(JSON.stringify({ received: true }));
}

//import type { Readable } from 'node:stream';
//import crypto from 'crypto';
// export const config = {
//   api: {
//     bodyParser: false
//   }
// };

// todo: fix async interation for readable
// async function getRawBody(readable: Readable): Promise<Buffer> {
//   const chunks = [];
//   for await (const chunk of readable) {
//     chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
//   }
//   return Buffer.concat(chunks);
// }

 // const rawBody = await getRawBody(req);
  // const sig = headers().get('X-Signature') as string;
  // const order = data.attributes;
  // const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  // console.log(sig, 'lemon webhook sig');
  // console.log(webhookSecret, 'lemon webhook');

  // console.log(JSON.stringify(data), 'lemon webhook body');
  // const event = data.meta.event_name;
  // console.log(event, 'event');

  // const hmac = crypto.createHmac('sha256', webhookSecret);
  // console.log(hmac, 'hmac');
  // const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  // const signature = Buffer.from(sig || '', 'utf8');
  // console.log(signature, 'signature');

  // console.log(digest, 'digest');

  // if (!crypto.timingSafeEqual(digest, signature)) {
  //   console.error('Invalid signature');
  //   return new Response(
  //     'Invalid signature. Webhook handler failed. View logs.',
  //     {
  //       status: 400
  //     }
  //   );
  // }
  // console.log(event, 'event');
  // console.log(body.attributes.customer_id, 'customer_id');
  // console.log(body.attributes.status, 'status');
  // console.log(body.attributes.store_id, 'store_id');
  // console.log(body.attributes.user_email, 'user_email');
  // console.log(body.attributes.order_number, 'order_number');
  // console.log(body.attributes.urls.receipt, 'receipt');
  // console.log(body.attributes.identifier, 'receipt');

// "attributes": {
//   "tax": 0,
//   "urls": {
//     "receipt": "https://app.lemonsqueezy.com/my-orders/2840601d-834e-47b1-a1cc-411f65495e2d?signature=9d76b4701a2577edcf2a1311a314b26004e2aa946849cc0844b04837f04fe9b0"
//   },
//   "total": 0,
//   "status": "paid",
//   "tax_usd": 0,
//   "currency": "USD",
//   "refunded": null,
//   "store_id": 31898,
//   "subtotal": 0,
//   "tax_name": null,
//   "tax_rate": "0.00",
//   "test_mode": true,
//   "total_usd": 0,
//   "user_name": "Luke Skywater",
//   "created_at": "2023-06-14T18:40:33.000000Z",
//   "identifier": "2840601d-834e-47b1-a1cc-411f65495e2d",
//   "updated_at": "2023-06-14T18:40:33.000000Z",
//   "user_email": "promtwizard@gmail.com",
//   "customer_id": 824032,
//   "refunded_at": null,
//   "order_number": 1,
//   "subtotal_usd": 0,
//   "currency_rate": "1.00000000",
//   "tax_formatted": "$0.00",
//   "discount_total": 0,
//   "total_formatted": "$0.00",
//   "first_order_item": {
//     "price": 3000,
//     "order_id": 855755,
//     "test_mode": true,
//     "created_at": "2023-06-14T18:40:33.000000Z",
//     "product_id": 84326,
//     "updated_at": "2023-06-14T18:40:33.000000Z",
//     "variant_id": 88850,
//     "product_name": "Interview Copilot",
//     "variant_name": "Default"
//   },
//   "status_formatted": "Paid",
//   "discount_total_usd": 0,
//   "subtotal_formatted": "$0.00",
//   "discount_total_formatted": "$0.00"
// },