'use client'
import { BellRing } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { LocaleSelector } from './LocaleSelector';
import { TopBarItems } from './TopbarItems';


export const TopBar = () => {
  const t = useTranslations('layout');

  return (
    <div className="bg-zinc-800 text-sm text-gray-300 md:text-xs">
      <div className="mx-auto flex flex-col items-center px-4 py-1 xl:container md:flex-row md:py-2.5">
        <BellRing size={16} className='ml-2' />
        <p className="pb-2 ml-4 md:pb-0">{t("annoncement")}</p>
        <ul className="hidden md:flex flex-wrap justify-center md:ml-auto">
          <TopBarItems />
          <LocaleSelector />
        </ul>
      </div>
    </div>
  );
};
