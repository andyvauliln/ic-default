import {
    getActiveProductsWithPrices,
    getSession,
    getSubscription
} from '@/app/supabase-server';
import Products from '@/components/Products';

export default async function Pricing() {
    const [session, products, subscription] = await Promise.all([
        getSession(),
        getActiveProductsWithPrices(),
        getSubscription()
    ]);

    return <Products products={products} subscription={subscription} user={session?.user} session={session} />
}
