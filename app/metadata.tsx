import type { Metadata } from 'next';

const meta = {
    title: 'Interviews Copilot',
    description: 'Helps prepare to interview, find job and provide ai answeres to interview questions in realtime call',
    cardImage: '/og.png',
    robots: 'follow, index',
    favicon: '/favicon.ico',
    url: 'https://interviewscopilot-andyvauliln.vercel.app',
    type: 'website'
};

const metadata: Metadata = {
    metadataBase: new URL(meta.url),
    title: {
        default: meta.title,
        template: `%s | ${meta.title}`
    },
    description: meta.description,
    robots: meta.robots,
    icons: meta.favicon,
    keywords: [''],
    authors: [{ name: 'Andrei Vaulin', url: '' }],
    openGraph: {
        images: meta.cardImage,
        url: meta.url,
        title: meta.title,
        description: meta.description,
        type: "website",
        siteName: meta.title
    },
    twitter: {
        card: 'summary_large_image',
        site: '@interviews_copilot',
        title: meta.title,
        description: meta.description,
        images: [meta.cardImage]
    },
    // appleWebApp: {
    //     capable: true,
    //     title: '$Willin$',
    //     statusBarStyle: 'black-translucent'
    //   },
    //   appLinks: {
    //     web: {
    //       url: BaseURL,
    //       should_fallback: true
    //     }
    //   },
    //   alternates: {
    //     canonical: BaseURL,
    //     languages: {
    //       'en-US': `${BaseURL}/en`,
    //       'zh-CN': `${BaseURL}/zh`
    //     }
    //   }
};

export default metadata