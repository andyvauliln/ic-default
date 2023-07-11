import type { Database } from '@/supabase/types_db';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

type Order = {
  order_id: string;
  customer_id: string;
  status: string;
  subscription_id: string;
  store_id: string;
  first_order_item: {
    order_id: string;
    variant_id: string;
    product_id: string;
  };
  user_email: string;
  identifier: string;
  urls: {
    receipt: string;
  };
};

const createOrGetCustomer = async (user_email: string, customer_id: string) => {
  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('customer_id', customer_id)
    .single();

  if (error || !data?.id) {
    console.log('trying to get user by email', user_email);
    const { data: userData, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', user_email)
      .single();

    console.log(error, 'cant get user by email (');

    if (userData?.id) {
      console.log(userData.id, 'got user by email');
      const { error: supabaseError } = await supabaseAdmin
        .from('customers')
        .insert([{ id: userData.id, customer_id: customer_id }]);
      if (supabaseError) throw supabaseError;
      console.log(`New customer created and inserted for ${userData.id}.`);
      return userData.id;
    } else {
      throw Error("user with this email dosn't exists");
    }
  }
  return data.id;
};


const onOrderCreated = async (order:Order, uuid:string) => {

  const subscriptionData: Database['public']['Tables']['subscriptions']['Insert'] =
    {
      order_id: order.first_order_item.order_id,
      user_id: uuid,
      customer_id: order.customer_id,
      status: order.status,
      store_id: order.store_id,
      variant_id: order.first_order_item.variant_id,
      product_id: order.first_order_item.product_id,
      user_email: order.user_email,
      updated: new Date(Date.now()).toISOString(),
      identifier: order.identifier,
      receipt: order.urls.receipt,
      last_event: 'order_created'
    };

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);
  if (error) throw error;
  console.log(
    `Inserted/updated order [${
      (subscriptionData.order_id, subscriptionData.customer_id)
    }] for user [${uuid}]`
  );
};

const onSubscriptionCreated = async (order:Order, event:string, id:string) => {

  let subscriptionData: Database['public']['Tables']['subscriptions']['Update'] =
    {
      status: order.status,
      updated: new Date(Date.now()).toISOString(),
      last_event: event,
      subscription_id: id
    };

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update(subscriptionData)
    .eq('order_id', order.order_id);

  if (error) throw error;
  console.log(`Updated subscription on ${event} event for sub id [${id}]`);
};

const updateUserNotion = async (uuid, notionPageId, notionToken) => {
  console.log(uuid, notionPageId, notionToken,'uuid, notionPageId, notionToken' );

  let userUpdate: Database['public']['Tables']['users']['Update'] =
    {
      notion_token: notionToken,
      notion_root_page_id: notionPageId,
    };

  const { error } = await supabaseAdmin
    .from('users')
    .update(userUpdate)
    .eq('id', uuid);

  if (error) throw error;
  console.log(`Updated Notion User data`);
};

const updateUserOpenAi = async (uuid, api_key) => {
  console.log(uuid, api_key,'uuid, api_key' );
  

  let userUpdate: Database['public']['Tables']['users']['Update'] =
    {
      openai_api_key: api_key
    };

  const { error } = await supabaseAdmin
    .from('users')
    .update(userUpdate)
    .eq('id', uuid);

  if (error) throw error;
  console.log(`Updated Open AI User data`);
};

const onSubscriptionUpdated = async (order:Order, event:string) => {
  // Upsert the latest status of the subscription object.
  let subscriptionData: Database['public']['Tables']['subscriptions']['Update'] =
    {
      status: order.status,
      updated: new Date(Date.now()).toISOString(),
      last_event: event
    };

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update(subscriptionData)
    .eq(
      order.order_id ? 'order_id' : 'subscription_id',
      order.order_id ? order.order_id : order.subscription_id
    )
    .select();
  if (error) throw error;
  console.log(
    `Updated subscription on ${event} event for [${
      order.order_id || order.subscription_id
    }]`
  );
};

export {
  createOrGetCustomer,
  onOrderCreated,
  onSubscriptionCreated,
  onSubscriptionUpdated,
  updateUserNotion,
  updateUserOpenAi
};

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  // if (createAction && subscription.default_payment_method && uuid)
  //   //@ts-ignore
  //   await copyBillingDetailsToCustomer(
  //     uuid,
  //     subscription.default_payment_method as Stripe.PaymentMethod
  //   );
//subscription_id
// const subscriptionData: Database['public']['Tables']['subscriptions']['Insert'] =
//     {
//       id: order.id,
//       user_id: uuid,
//       metadata: subscription.metadata,
//       status: subscription.status,
//       price_id: subscription.items.data[0].price.id,
//       //TODO check quantity on subscription
//       // @ts-ignore
//       quantity: subscription.quantity,
//       cancel_at_period_end: subscription.cancel_at_period_end,
//       cancel_at: subscription.cancel_at
//         ? toDateTime(subscription.cancel_at).toISOString()
//         : null,
//       canceled_at: subscription.canceled_at
//         ? toDateTime(subscription.canceled_at).toISOString()
//         : null,
//       current_period_start: toDateTime(
//         subscription.current_period_start
//       ).toISOString(),
//       current_period_end: toDateTime(
//         subscription.current_period_end
//       ).toISOString(),
//       created: toDateTime(subscription.created).toISOString(),
//       ended_at: subscription.ended_at
//         ? toDateTime(subscription.ended_at).toISOString()
//         : null,
//       trial_start: subscription.trial_start
//         ? toDateTime(subscription.trial_start).toISOString()
//         : null,
//       trial_end: subscription.trial_end
//         ? toDateTime(subscription.trial_end).toISOString()
//         : null
//     };