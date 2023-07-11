//@ts-nocheck
import { Transition } from '@headlessui/react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';



export const LocaleSelector = () => {
  const [isLocaleSelectorOpen, setIsLocaleSelectorOpen] = useState(false);
  const router = useRouter();
  const currentLocale = useLocale();
  const pathname = usePathname();
  const searchparams = useSearchParams();
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, () => setIsLocaleSelectorOpen(false));

  const locales = [
    ['en', 'English', '/assets/en-flag.svg'],
    ['de', 'German', '/assets/de-flag.svg'],
  ];

  return (
    <div
      className="relative z-50 ml-2.5 flex cursor-pointer items-center"
      ref={ref}
      onClick={() => setIsLocaleSelectorOpen(prev => !prev)}
    >
      <div className="relative mr-1.5 h-3.5 w-3.5 md:h-[17px] md:w-[17px]">
        <Image
          priority
          src={`/assets/${currentLocale}-flag.svg`}
          alt={`${currentLocale} locale`}
          fill
        />
      </div>
      <span>{currentLocale.toUpperCase()}</span>
      <ChevronDown size={20} />
      <Transition
        show={isLocaleSelectorOpen}
        enter="transition-all duration-300"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-3"
        leave="transition-all duration-300"
        leaveFrom="opacity-100 translate-y-3"
        leaveTo="opacity-0 translate-y-1"
      >
        <ul className="absolute right-0 flex w-[90px] flex-col overflow-hidden rounded-sm bg-black text-xs">
          {locales.map(([locale, label, flagURL]) => (
            <li key={locale} className="transition-colors hover:bg-neutral-600">
              <button
                className="flex items-center px-2 py-1 text-white"
                onClick={() => {
                  let path = pathname;

                  if (currentLocale !== "en") {
                    let linkArray = path.split("/");
                    linkArray[1] = locale;
                    path = linkArray.join("/");
                  }
                  else {
                    path = `/${locale}${pathname}`
                  }
                  router.replace(`${path}${searchparams ? `?${searchparams}` : ""}`);
                }
                }
              >
                <Image
                  priority
                  src={flagURL}
                  alt={`${locale} locale`}
                  width={17}
                  height={17}
                />
                <span className="ml-2">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </Transition>
    </div >
  );
};
