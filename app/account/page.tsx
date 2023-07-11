import { env } from '@/app/env.mjs';
import {
  getActiveProductsWithPrices,
  getSession,
  getSubscription,
  getUserDetails
} from '@/app/supabase-server';
import Prices from '@/components/Prices';
import { Database } from '@/supabase/types_db';
import { updateUserNotion, updateUserOpenAi } from '@/utils/supabase-admin';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Session, User } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Account() {
  const checkoutLinks = JSON.parse(env.LEMON_SQUEEZY_CHECKOUT_LINKS)
  const [session, subscription, userDetails] = await Promise.all([
    getSession(),
    getSubscription(),
    getUserDetails()
  ]);

  if (!session) {
    return redirect('/signin');
  }

  const user = session?.user as User;
  console.log(user, "************USER*********");

  const updateEmail = async (formData: FormData) => {
    'use server';

    const newEmail = formData.get('email') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const resp = await supabase.auth.updateUser({ email: newEmail });

    revalidatePath('/account');
  };
  const updateAPIkey = async (formData: FormData) => {
    'use server';

    const new_api_key = formData.get('openai_api_key') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const resp = await updateUserOpenAi(user.id, new_api_key);

    revalidatePath('/account');
  };

  const updateNotion = async (formData: FormData) => {
    'use server';



    const notion_root_page_id = formData.get('notion_root_page_id') as string;
    const notion_token = formData.get('notion_token') as string;
    console.log('otion_root_page_id, notion_token', notion_root_page_id, notion_token);
    const supabase = createServerActionClient<Database>({ cookies });
    const resp = await updateUserNotion(user.id, notion_root_page_id, notion_token);

    console.log(resp, "********RESP NOTION**********");


    revalidatePath('/account');
  };

  return (
    <section className="mb-32">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white text-center sm:text-6xl ">
          Account
        </h1>
      </div>

      <div className="px-4">

        <Card
          title="Subscription Plan"
          description={
            subscription
              ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
              : 'You are not currently subscribed to any plan.'
          }
          footer={subscription ? <ManageSubscriptionButton portalLink={subscription.receipt!} /> : <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <p className="pb-4 sm:pb-0">
              Choose your plan.
            </p>
            <Link
              href="/pricing"
              className="text-white group relative flex left select-none items-center justify-center gap-2 px-3 py-1 outline-none focus-visible:ring-4 bg-purple-600 hover:bg-purple-700 rounded h-[36px] whitespace-nowrap text-xs transition ml-2 cursor-pointer"
            >
              <span className="select-none font-bold" >Pricing</span>
            </Link>
          </div>}
        >
        </Card>
        <Card
          title="Notion Connection"
          description=""
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                Where you ll have acces to your cvs.
              </p>
              <button
                form="notionForm"
                className="text-white group relative flex left select-none items-center justify-center gap-2 px-3 py-1 outline-none focus-visible:ring-4 bg-purple-600 hover:bg-purple-700 rounded h-[36px] whitespace-nowrap text-xs transition ml-2 cursor-pointer"
                type="submit"
              >
                <span className="select-none font-bold" >Update Notion Data</span>
              </button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="notionForm" className='flex flex-col' action={updateNotion}>
              <p className="text-zinc-300 mb-2">Please enter you notion root page ID</p>
              <input
                type="text"
                name="notion_root_page_id"
                className="w-1/2 p-3 rounded-md bg-zinc-900"
                defaultValue={userDetails ? userDetails.notion_root_page_id : ''}
                placeholder="Notion Root Page ID"
              />
              <p className="text-zinc-300 mt-4">Please enter you notion api token</p>
              <input
                type="text"
                name="notion_token"
                className="w-1/2 p-3 mt-4 rounded-md bg-zinc-900"
                defaultValue={userDetails ? userDetails.notion_token : ''}
                placeholder="Your notion token"
                maxLength={64}
              />
            </form>
          </div>
        </Card>


        <Card
          title="Open AI API Key"
          description="Please enter you api key and save it."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                After submit we ll use your open ai account.
              </p>
              <button
                form="apiForm"
                className="text-white group relative flex left select-none items-center justify-center gap-2 px-3 py-1 outline-none focus-visible:ring-4 bg-purple-600 hover:bg-purple-700 rounded h-[36px] whitespace-nowrap text-xs transition ml-2 cursor-pointer"
                type="submit"
              >
                <span className="select-none font-bold" >Save API Key</span>
              </button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="apiForm" action={updateAPIkey}>
              <input
                type="text"
                name="openai_api_key"
                className="w-1/2 p-3 rounded-md bg-zinc-900"
                defaultValue={userDetails ? userDetails.openai_api_key : ''}
                placeholder="Your api key"
                maxLength={64}
              />
            </form>
          </div>
        </Card>
        <Card
          title="Your Email"
          description="Please enter the email address you want to use to login."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                After update  go to your email accounts and confirm old and new email.
              </p>
              <button
                form="emailForm"
                className="text-white group relative flex left select-none items-center justify-center gap-2 px-3 py-1 outline-none focus-visible:ring-4 bg-purple-600 hover:bg-purple-700 rounded h-[36px] whitespace-nowrap text-xs transition ml-2 cursor-pointer"
                type="submit"
              >
                <span className="select-none font-bold" >Update Email</span>
              </button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="emailForm" action={updateEmail}>
              <input
                type="text"
                name="email"
                className="w-1/2 p-3 rounded-md bg-zinc-900"
                defaultValue={user ? user.email : ''}
                placeholder="Your email"
                maxLength={64}
              />
            </form>
          </div>
        </Card>
      </div>
    </section >
  );
}

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8  rounded-md">
      <div className='pb-10 mb-10 shadow-bottom shadow-purple-500'></div>
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="p-4 mx-4 bg-zinc-900 text-zinc-500">
        {footer}
      </div>
    </div>
  );
}

interface ButtonProps {
  portalLink: string;
}


function ManageSubscriptionButton({ portalLink }: ButtonProps) {

  return (
    <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <p className="pb-4 sm:pb-0">Manage your subscription.</p>
      <Link className="text-white  relative flex left select-none items-center justify-center gap-2 px-3 py-1 outline-none font-bold focus-visible:ring-4 bg-purple-600 hover:bg-purple-700 rounded h-[36px] whitespace-nowrap text-xs transition ml-2 cursor-pointer"
        href={portalLink} target='_blank' rel="noopener noreferrer">Open Paymant Portal</Link>
    </div>
  );
}

interface SubscriptionProps {
  session: Session;
  checkoutLinks: { [key: string]: string };
}
type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
  prices: Price[];
}

async function SubscriptionPlan({ session, checkoutLinks }: SubscriptionProps) {
  const products = await getActiveProductsWithPrices();

  return <div className="relative flex self-center mt-6 justify-center items-center flex-col sm:flex-row ">
    <Prices product={products[0]} checkoutLinks={checkoutLinks} />
  </div>
}



// <Card
// title={"Your Name"}
// description="Please enter your full name, or a display name you are comfortable with."
// footer={
//   <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
//     <p className="pb-4 sm:pb-0">64 characters maximum</p>
//     <button
//       form="nameForm"
//       className="text-white group relative flex left select-none items-center justify-center gap-2 px-3 py-1 outline-none focus-visible:ring-4 bg-purple-600 hover:bg-purple-700 rounded h-[36px] whitespace-nowrap text-xs transition ml-2 cursor-pointer"
//       type="submit"
//     >
//       <span className="select-none font-bold" >Update Name</span>
//     </button>

//   </div>
// }
// >
// <div className="mt-8 mb-4 text-xl font-semibold">
//   <form id="nameForm" action={updateName}>
//     <input
//       type="text"
//       name="name"
//       className="w-1/2 p-3 rounded-md bg-zinc-900"
//       defaultValue={userDetails?.full_name ?? ''}
//       placeholder="Your name"
//       maxLength={64}
//     />
//   </form>
// </div>
// </Card>
// const updateName = async (formData: FormData) => {
//   'use server';
//   console.log(formData, "form data");

//   const newName = formData.get('name') as string;
//   const supabase = createServerActionClient<Database>({ cookies });
//   const session = await getSession();
//   const user = session?.user;
//   const { error } = await supabase
//     .from('users')
//     .update({ full_name: newName })
//     .eq('id', user?.id);
//   if (error) {
//     console.log(error);
//   }
//   revalidatePath('/account');
// };