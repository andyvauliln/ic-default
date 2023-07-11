'use client'
import { ChevronDown, LucideIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { LocaleSelector } from './LocaleSelector';

interface TopbarItemProps {
    label: string;
    url: string;
    Icon?: LucideIcon;
}

const TopbarItem = ({ label, url, Icon }: TopbarItemProps) => (
    <li className="mx-1 pb-px md:mr-2.5 lg:[&:nth-of-type(3)]:mr-10 lg:[&:nth-of-type(5)]:mr-10">
        <Link
            href={url}
            className="flex items-center transition-colors hover:text-purple-600 hover:font-extrabold"
        >
            {Icon && <Icon className="mx-1 md:text-sm"></Icon>}
            <span>{label}</span>
        </Link>
    </li>
);

export const TopBarItems = () => {
    const t = useTranslations('layout');

    const topbarItems: TopbarItemProps[] = [
        { label: t('pricing'), url: 'pricing' },
        { label: t('roadmap'), url: 'roadmap' },
    ];

    return (
        <>
            {topbarItems.map(item => (
                <TopbarItem key={item.label} {...item} />
            ))}
        </>
    )
};
