'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NextIntlClientProvider } from 'next-intl';
// import { useReportWebVitals } from 'next/web-vitals';
import { FC, ReactNode } from "react";
import SupabaseProvider from './supabase-provider';

interface LayoutProps {
    children: ReactNode,
    locale: string,
    messages: any,
}

const Providers: FC<LayoutProps> = ({ children, locale = "en", messages = {} }) => {
    // useReportWebVitals((metric) => {
    //     console.log(metric)
    // })

    const queryClient = new QueryClient()
    return (
        <SupabaseProvider>

            <QueryClientProvider client={queryClient}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    {children}
                    {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools /> : null}
                </NextIntlClientProvider>
            </QueryClientProvider>

        </SupabaseProvider>

    )
}

export default Providers
