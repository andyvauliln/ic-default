import { notFound } from 'next/navigation';

import '@/styles/globals.css';
import { ReactNode } from 'react';

const meta = {
    title: 'Interviews Copilot',
    description: 'Helps prepare to interview, find job and provide ai answeres to interview questions in realtime call',
    cardImage: '/og.png',
    robots: 'follow, index',
    favicon: '/favicon.ico',
    url: 'https://interviewscopilot-andyvauliln.vercel.app',
    type: 'website'
};

export const metadata = {
    metadataBase: new URL(meta.url),
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage,
    robots: meta.robots,
    favicon: meta.favicon,
    url: meta.url,
    type: meta.type,
    openGraph: {
        url: meta.url,
        title: meta.title,
        description: meta.description,
        cardImage: meta.cardImage,
        type: meta.type,
        site_name: meta.title
    },
    twitter: {
        card: 'summary_large_image',
        site: '@interviews_copilot',
        title: meta.title,
        description: meta.description,
        cardImage: meta.cardImage
    }
};

type LocaleLayoutProps = {
    children: ReactNode;
    params: {
        locale?: string;
    };
};

export default async function LocaleLayout({
    children,
    params: { locale = 'en' },
}: LocaleLayoutProps) {


    return (
        <html lang={locale}>
            <body>
                <main
                    className="min-h-[100dvh]"
                >
                    {children}
                </main>
            </body>
        </html>
    );
}
