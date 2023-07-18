"use client"
import Logo from '@/components/icons/Logo';
import { useSupabase } from '@/components/supabase-provider';
// import { Transition } from '@headlessui/react';
import { Session } from '@supabase/supabase-js';
import { LogIn, LogOut, LucideIcon, UserCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { LocaleSelector } from './LocaleSelector';
import { TopBar } from './TopBar';
import { TopBarItems } from './TopbarItems';

export interface NavLink {
  name: 'train' | 'copilot' | "jobs" | "cv";
  href: string;
}

export const navLinks: NavLink[] = [
  { name: 'home', href: '/' },
  { name: 'train', href: '/train' },
  { name: 'copilot', href: '/copilot' },
  { name: 'jobs', href: '/jobs' },
  { name: 'workflows', href: '/workflows' },
  { name: 'build', href: '/build' },
];

interface Props {
  session: Session,
}


export default function Header({ session }: Props) {
  const t = useTranslations('layout');
  let sideNavLinks: [string, LucideIcon][] = [];
  if (session) {
    sideNavLinks = [['/account', UserCircle2], ['/signout', LogOut]];
  }
  else {
    sideNavLinks = [['/signin', LogIn]]
  }



  //bg-gradient-to-br from-purple-600 to-gray-900
  //style={{ background: "rgba(16 18 27 / 30%)" }}
  ///bg-gradient-to-r from-zinc-900 via-zink-600 to-zinc-900
  //bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#27272a] via-[##27272a] to-[rgba(16 18 27 / 9%)]
  const pathname = usePathname();
  const [hoveredNavLink, setHoveredNavLink] = useState<NavLink | null>();
  const handleShowMenu = (navLink: NavLink) => setHoveredNavLink(navLink);
  const handleCloseMenu = () => setHoveredNavLink(null);

  return (
    <header>
      <TopBar />
      <div style={{ backgroundImage: "radial-gradient(circle,rgba(16 18 27 / 30%), #27272a" }} className="relative h-14 shadow-bottom shadow-zinc-900">
        <div className="mx-auto flex h-full items-center px-4 xl:container">
          <div className="mr-5 flex shrink-0 items-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <ul className="ml-auto hidden h-full md:flex ]">
            {navLinks.map((item, index) => (
              <li
                className={`font-medium  text-purple-500 ${(hoveredNavLink === item || pathname === item.href) && 'from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r background-animate bg-clip-text text-transparent font-extrabold text-2xl'
                  }`}
                key={index}
                onMouseEnter={() => handleShowMenu(item)}
                onMouseLeave={handleCloseMenu}
              >
                <Link
                  href={item.href}
                  className="flex h-full items-center px-5"
                  onClick={handleCloseMenu}
                >
                  {t(item.name)}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="md:hidden ml-auto flex justify-end">
            <TopBarItems />
            <LocaleSelector />
          </ul>

          <ul className="flex items-center ml-auto">
            {sideNavLinks.map(([url, Icon]) => (
              <Link key={url} href={url} className="ml-5">
                <Icon
                  className="transition-colors hover:text-violet-700"
                  size="20px"
                />
              </Link>
            ))}
          </ul>
        </div>
      </div>
      <BottomNavigation />
    </header>
  );
};
