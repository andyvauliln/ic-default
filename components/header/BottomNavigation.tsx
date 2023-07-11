"use client"
import { Bot, FileText, GraduationCap, Home, LucideIcon, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';


interface BottomTab {
  title: string;
  url: string;
  Icon: LucideIcon;
}

export const BottomNavigation = () => {
  const pathname = usePathname();
  const t = useTranslations('layout');

  const [currentTab, setCurrentTab] = useState('');

  const bottomTabs: BottomTab[] = [
    { title: t('home'), url: '/', Icon: Home },
    { title: t('train'), url: '/train', Icon: GraduationCap },
    { title: t('copilot'), url: '/copilot', Icon: Bot },
    { title: t('jobs'), url: '/jobs', Icon: Search },
    { title: t('cv'), url: '/cv', Icon: FileText },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white drop-shadow-[0_-15px_20px_rgba(0,0,0,0.10)] md:hidden">
        <ul className="flex h-full">
          {bottomTabs.map((tab, index) => (
            <li key={index} className="flex-1">
              <Link
                href={tab.url}
                className={`flex h-full w-full flex-col items-center justify-center text-xs font-medium text-neutral-700 hover:text-violet-700 ${pathname === tab.url && 'text-violet-700'
                  }`}
                onClick={() => setCurrentTab(tab.url)}
              >
                <tab.Icon size={'1.5rem'} />
                {/* <span className="mt-1">{tab.title}</span> */}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
