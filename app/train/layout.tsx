'use client'
import type { TabItem, TabsInterface, TabsOptions } from "flowbite";
import { Tabs } from "flowbite";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import { cn } from '../../utils/helpers';

/* eslint-disable @next/next/no-img-element */
export default function TrainLayout({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const pathname = usePathname();

    const getClassName = (path, type = "settings") => {
        if (type = "settings") {
            if (path === pathname) {
                return "text-purple-500 border-purple-500"
            }
            return "border-transparent hover:text-purple-500 hover:border-purple-500"
        }
        if (type = "icon") {
            if (path === pathname) {
                return "text-purple-500"
            }

            return "text-gray-400 group-hover:text-gray-500 "
        }
    }


    return (
        <div className="container bg-base lg:px-32 text-secondaryBrown">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">

                    <li className="mr-2" id='dashboard-tab'>
                        <a href="/train/dashboard" className={cn(getClassName('/train/dashboard'), "inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group")} >
                            <svg className={cn(getClassName('/train/dashboard', "icon"), "w-4 h-4 mr-2")} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                            </svg>Dashboard
                        </a>
                    </li>

                    <li className="mr-2" id='settings-tab' aria-current="page">
                        <a href="/train/settings" className={cn(getClassName('/train/settings'), "inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group")}>
                            <svg className={cn(getClassName('/train/settings', "icon"), "w-4 h-4 mr-2")} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z" />
                            </svg>Settings
                        </a>
                    </li>
                    <li className="mr-2" id="train-tab">
                        <a href="/train/mock" className={cn(getClassName('/train/mock'), "inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group")}>
                            <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                            </svg>Train
                        </a>
                    </li>
                    <li className="mr-2" id="position-tab">
                        <a href="/train/position" className={cn(getClassName('/train/position'), "inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group")}>
                            <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                            </svg>Job Position
                        </a>
                    </li>
                    <li className="mr-2" id="cv-tab">
                        <a href="/train/cv" className={cn(getClassName('/train/cv'), "inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group")}>
                            <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                            </svg>CV
                        </a>
                    </li>
                </ul>
            </div>
            <div id="tabContentExample">
                {children}
            </div>
        </div>
    )
}
