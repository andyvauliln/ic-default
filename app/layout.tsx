import Providers from '@/components/Providers';
import Footer from '@/components/footer';
import Header from '@/components/header';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';

import { getSession, } from '@/app/supabase-server';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import metadata from './metadata';
export const dynamic = 'force-dynamic'

export default async function LocaleLayout({
    children,
    params: { locale = 'en' },
}: LocaleLayoutProps) {
    const session = await getSession();
    let messages;
    try {
        messages = (await import(`../messages/${locale}.json`)).default;

    } catch (error) {
        console.log(error);

    }

    return (
        <html lang={locale}>
            <body className='dark-mode'>
                <Providers locale={locale} messages={messages}>
                    <Header session={session} />
                    <main
                        className="min-h-[100dvh]"
                    >
                        {children}
                        <Analytics />
                    </main>
                    <Footer />
                </Providers>
                <Toaster />
            </body>
        </html>
    );
}

export { metadata };

type LocaleLayoutProps = {
    children: ReactNode;
    params: {
        locale?: string;
    };
};
