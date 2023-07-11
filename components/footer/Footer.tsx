"use client"
import FeaturesForm from '@/components/roadmap/FeaturesForm';
import { cn } from '@/utils/helpers';
import { Instagram, LucideIcon, Send, Twitter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const socialMedias: [LucideIcon, string][] = [
  [Instagram, 'https://instagram.com', "text-purple-600 shadow-md shadow-zinc-800"],
  [Twitter, 'https://twitter.com', "text-blue-400 mx-3"],
  [Send, 'https://telegram.com', "text-blue-600"],
];

//style={{ backdropFilter: "blur(3px)" }}

export default function Footer() {
  const t = useTranslations('layout');
  // const [hoveredBox, setHoveredBox] = React.useState(false);
  // const handleShowSocialMedia = () => setHoveredBox(true);
  // const handleCloseSocialMedia = () => setHoveredBox(false);

  const footerLinks = [
    {
      label: t('company'),
      links: [
        [t('roadmap'), '/roadmap'],
        [t('pricing'), '/pricing'],
        [t('termsOfUse'), '/terms-of-use'],
        [t('privacyPolicy'), '/privacy-policy'],
      ],
    },
    {
      label: t('contact'),
      links: [
        [t('feedback'), '/roadmap'],
        [t('support'), '/roadmap'],
        [t('idea'), '/roadmap'],
        [t('bussiness'), '/roadmap'],
      ],
    },
    {
      label: t('contact'),
      links: [
        [t('feedback'), '/roadmap'],
        [t('support'), '/roadmap'],
        [t('idea'), '/roadmap'],
        [t('bussiness'), '/roadmap'],
      ],
    },
  ];

  return (
    <footer className="mb-16 md:mb-0 circuits shadow-top shadow-zinc-900" >
      <div className='w-full' >
        <div className="mx-auto max-w-7xl px-4 py-10" >
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col md:flex-1">

              <div className="my-5 flex justify-center flex-col md:justify-start">
                <div className="my-5 flex justify-center flex-col md:justify-start">

                  <div
                    className="text-5xl p-4 text-center font-bold from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r background-animate bg-clip-text text-transparent"
                  >
                    Follow us!

                  </div>
                  <div className="justify-center flex">
                    {socialMedias.map(([Icon, href, className], i) => (
                      <Link
                        key={i}
                        href={href ?? "#"}
                        target="_blank"
                        className={cn("", className)}
                      >
                        <Icon size={40} className={className} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex md:mt-0 md:flex-[2] justify-around md:justify-between" >
              {footerLinks.map(({ label, links }) => (
                <div key={label} className="flex flex-col">
                  <strong className="mb-5 text-xl font-bold bg-clip-text text-transparent from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r background-animate">
                    {label}
                  </strong>
                  <ul className="flex flex-col gap-2 text-xs font-extrabold  md:text-sm">
                    {links.map(([label, href], i) => (
                      <Link
                        key={i}
                        href={href ?? "#"}
                        className="transition hover:text-purple-500"
                      >
                        {label}
                      </Link>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-neutral-100">
          <div className="mx-auto max-w-7xl px-2 py-3">
            <div className="flex flex-col items-center justify-between gap-3 text-xs font-medium text-neutral-700 md:flex-row">
              <p>{t('copyright')}</p>
              {/* <Link href="https://github.com/andyvauliln/interviewscopilot" target="_blank">
              <BsGithub size="1.25rem" />
            </Link> */}
              <p>
                {`${t('createdBy')} `}
                <strong>
                  <Link href="https://github.com/andyvauliln" target="_blank">
                    Vaulin.A
                  </Link>
                </strong>
                {'. '}
                {t('reserved')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
