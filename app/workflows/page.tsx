//import { Content } from '@radix-ui/react-tooltip'
'use client';
import Airtable from '@/public/assets/airtable-svgrepo-com.svg';
import Aurelia from '@/public/assets/aurelia-svgrepo-com.svg';
import Dynamodb from '@/public/assets/aws-dynamodb-svgrepo-com.svg';
import Discord from '@/public/assets/discord-icon-svgrepo-com.svg';
import { Carousel } from 'flowbite-react';
import Image from 'next/image';
import React, { FC } from 'react';
import workflows from '../workflows.json';
import { text } from 'stream/consumers';


const Workflow = ({ user = { name: "@user1" } }) => {
    const [searchText, setSearch] = React.useState("");
    const [filter, setFilter] = React.useState('user');
    console.log('filter', filter);

    const filteredItems = items.filter(r => (searchText && (r.title.toLowerCase().includes(searchText.toLowerCase()) || r.prompt.toLowerCase().includes(searchText.toLowerCase()))) ||
        (!searchText && ((filter === "user" && user.name === r.owner) || r.type === filter)))

    return <div className='px-16 py-16'>
        <div className="">
            <h1 className="text-2xl font-bold px-3 ">Popular Workflow</h1>
            <h2 className="text-zinc-500 px-3">
                Buy, Sell and Earn money by helping finish workflows with issues.
            </h2>
            <div className="p-3 h-[600px] mb-4 ">

                <Slider user={user} topFree={items.filter(r => r.type === 'public')} topMarket={items.filter(r => r.type === 'market')} topIssue={items.filter(r => r.type === 'issue')} />
            </div>
            <div className='mt-14'>
                <div className="flex flex-col md:flex-row justify-between px-3 pb-3">

                    <ul className="inline-flex md:w-1/3 w-full  space-x-3">
                        {['User', 'Public', 'Market', 'Earn'].map((text, index) => (
                            <li key={text} className="text-xl">
                                <button
                                    onClick={e => setFilter(text === "Earn" ? "issue" : text.toLowerCase())}
                                    className={` ${text.toLowerCase() !== filter ? 'text-zinc-500' : 'text-fuchsia-600 underline font-bold'
                                        }`}
                                >
                                    {text}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        name="search"
                        placeholder="Search"
                        className="h-[36px] ml-2  md:w-1/3 w-full rounded  p-2 bg-zinc-900"
                        value={searchText}
                        onChange={r => setSearch(r.target.value)}
                    />
                </div>
            </div >
        </div>
        <ul className="p-1.5 flex flex-wrap">
            {filteredItems.map((item) => <Item key={item.id} item={item} isOwner={user.name === item.owner} />)}
        </ul>
    </div>
}

export default Workflow

const items = [
    {
        id: '1',
        image: 'https://images.unsplash.com/photo-1599422314077-f4dfdaa4cd09?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODR8fGFic3RyYWN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
        price: '',
        owner: '@user1',
        tags: ['productivity, notion, discord, aiAgents'],
        title: 'Image converter',
        type: 'public',
        prompt: " Peruse Twitter posts daily for hashtags #WEB3 #Crypto and save them to my Notion account. Propose 10 topics for YouTube videos derived from these posts, and send them to me via Telegram. Upon receiving my preferences and topic choice, create a script for a 10-minute video in the style of Rick and Morty, complete with a catchy title and thumbnail. After my approval via Telegram, produce videos in English, Indonesian, and German using a 'Rick' voiceover, for my review. If approved, upload the videos to YouTube."
    },
    {
        id: '2',
        image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NzB8fGFic3RyYWN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
        price: '200 USDT',
        type: 'market',
        owner: '@user1',
        tags: ['data, notion, airtable, aiAgents'],
        title: 'GPT Assistant for searching the job',
        prompt: " Peruse Twitter posts daily for hashtags #WEB3 #Crypto and save them to my Notion account. Propose 10 topics for YouTube videos derived from these posts, and send them to me via Telegram. Upon receiving my preferences and topic choice, create a script for a 10-minute video in the style of Rick and Morty, complete with a catchy title and thumbnail. After my approval via Telegram, produce videos in English, Indonesian, and German using a 'Rick' voiceover, for my review. If approved, upload the videos to YouTube."
    },
    {
        id: '3',
        image: 'https://images.unsplash.com/photo-1608501821300-4f99e58bba77?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTAxfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
        price: '9.0 ETH',
        type: 'private',
        owner: '@user3',
        tags: ['notification, notion, telegram, aiAgents'],
        title: 'Image recognition',
        prompt: " Peruse Twitter posts daily for hashtags #WEB3 #Crypto and save them to my Notion account. Propose 10 topics for YouTube videos derived from these posts, and send them to me via Telegram. Upon receiving my preferences and topic choice, create a script for a 10-minute video in the style of Rick and Morty, complete with a catchy title and thumbnail. After my approval via Telegram, produce videos in English, Indonesian, and German using a 'Rick' voiceover, for my review. If approved, upload the videos to YouTube."
    },
    {
        id: '4',
        image: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjR8fGFic3RyYWN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
        price: 0,
        owner: '@user1',
        type: 'issue',
        tags: ['huggingface, lamaIndex'],
        title: 'Pirice Alerts for crypto market',
        prompt: " Peruse Twitter posts daily for hashtags #WEB3 #Crypto and save them to my Notion account. Propose 10 topics for YouTube videos derived from these posts, and send them to me via Telegram. Upon receiving my preferences and topic choice, create a script for a 10-minute video in the style of Rick and Morty, complete with a catchy title and thumbnail. After my approval via Telegram, produce videos in English, Indonesian, and German using a 'Rick' voiceover, for my review. If approved, upload the videos to YouTube."
    },
    {
        id: '5',
        image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzF8fGFic3RyYWN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
        price: 0,
        owner: '@user1',
        type: 'private',
        tags: ['youtube, telegram, video'],
        title: 'Youtube shorts maker',
        prompt: " Peruse Twitter posts daily for hashtags #WEB3 #Crypto and save them to my Notion account. Propose 10 topics for YouTube videos derived from these posts, and send them to me via Telegram. Upon receiving my preferences and topic choice, create a script for a 10-minute video in the style of Rick and Morty, complete with a catchy title and thumbnail. After my approval via Telegram, produce videos in English, Indonesian, and German using a 'Rick' voiceover, for my review. If approved, upload the videos to YouTube."
    },
    {
        id: '6',
        tags: ['GPT-4, wisper, generation'],
        image: 'https://images.unsplash.com/photo-1555448248-2571daf6344b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTh8fGFic3RyYWN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
        price: '',
        owner: '@user6',
        type: 'public',
        title: 'Analtic for Uniswap',
        prompt: " Peruse Twitter posts daily for hashtags #WEB3 #Crypto and save them to my Notion account. Propose 10 topics for YouTube videos derived from these posts, and send them to me via Telegram. Upon receiving my preferences and topic choice, create a script for a 10-minute video in the style of Rick and Morty, complete with a catchy title and thumbnail. After my approval via Telegram, produce videos in English, Indonesian, and German using a 'Rick' voiceover, for my review. If approved, upload the videos to YouTube."
    },
    {
        id: '7',
        tags: ['GPT-4, wisper, generation'],
        image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NzB8fGFic3RyYWN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
        price: '1.3 ETH',
        type: 'private',
        owner: '@user1',
        title: 'Analtic for Uniswap',
        prompt: " Peruse Twitter posts daily for hashtags #WEB3 #Crypto and save them to my Notion account. Propose 10 topics for YouTube videos derived from these posts, and send them to me via Telegram. Upon receiving my preferences and topic choice, create a script for a 10-minute video in the style of Rick and Morty, complete with a catchy title and thumbnail. After my approval via Telegram, produce videos in English, Indonesian, and German using a 'Rick' voiceover, for my review. If approved, upload the videos to YouTube."
    },
    {
        id: '8',
        tags: ['GPT-4, wisper, generation'],
        image: 'https://images.unsplash.com/photo-1608501821300-4f99e58bba77?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTAxfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
        price: '1.3 ETH',
        owner: '@user7',
        type: 'private',
        title: 'Analtic for Uniswap',
        prompt: " Peruse Twitter posts daily for hashtags #WEB3 #Crypto and save them to my Notion account. Propose 10 topics for YouTube videos derived from these posts, and send them to me via Telegram. Upon receiving my preferences and topic choice, create a script for a 10-minute video in the style of Rick and Morty, complete with a catchy title and thumbnail. After my approval via Telegram, produce videos in English, Indonesian, and German using a 'Rick' voiceover, for my review. If approved, upload the videos to YouTube."
    },
    {
        id: '9',
        tags: ['GPT-4, wisper, generation'],
        image: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjR8fGFic3RyYWN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
        price: '1.3 ETH',
        type: 'market',
        owner: '@user2',
        title: 'Analtic for Uniswap',
        prompt: " Peruse Twitter posts daily for hashtags #WEB3 #Crypto and save them to my Notion account. Propose 10 topics for YouTube videos derived from these posts, and send them to me via Telegram. Upon receiving my preferences and topic choice, create a script for a 10-minute video in the style of Rick and Morty, complete with a catchy title and thumbnail. After my approval via Telegram, produce videos in English, Indonesian, and German using a 'Rick' voiceover, for my review. If approved, upload the videos to YouTube."
    },
    {
        id: '10',
        tags: ['GPT-4, wisper, generation'],
        image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzF8fGFic3RyYWN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
        price: '',
        type: 'public',
        owner: '@user1',
        title: 'Analtic for Uniswap',
        prompt: " Peruse Twitter posts daily for hashtags #WEB3 #Crypto and save them to my Notion account. Propose 10 topics for YouTube videos derived from these posts, and send them to me via Telegram. Upon receiving my preferences and topic choice, create a script for a 10-minute video in the style of Rick and Morty, complete with a catchy title and thumbnail. After my approval via Telegram, produce videos in English, Indonesian, and German using a 'Rick' voiceover, for my review. If approved, upload the videos to YouTube."
    },
    {
        id: '11',
        tags: ['GPT-4, wisper, generation'],
        image: 'https://images.unsplash.com/photo-1555448248-2571daf6344b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTh8fGFic3RyYWN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
        price: '1.3 ETH',
        type: 'market',
        owner: '@user2',
        title: 'Analtic for Uniswap',
        prompt: " Peruse Twitter posts daily for hashtags #WEB3 #Crypto and save them to my Notion account. Propose 10 topics for YouTube videos derived from these posts, and send them to me via Telegram. Upon receiving my preferences and topic choice, create a script for a 10-minute video in the style of Rick and Morty, complete with a catchy title and thumbnail. After my approval via Telegram, produce videos in English, Indonesian, and German using a 'Rick' voiceover, for my review. If approved, upload the videos to YouTube."
    },
    {
        id: '12',
        tags: ['GPT-4, wisper, generation'],
        image: '/assets/nft-dashboard-art-1.jpeg',
        price: '1.3 ETH',
        type: 'issue',
        owner: '@user2',
        title: 'Analtic for Uniswap',
        prompt: " Peruse Twitter posts daily for hashtags #WEB3 #Crypto and save them to my Notion account. Propose 10 topics for YouTube videos derived from these posts, and send them to me via Telegram. Upon receiving my preferences and topic choice, create a script for a 10-minute video in the style of Rick and Morty, complete with a catchy title and thumbnail. After my approval via Telegram, produce videos in English, Indonesian, and German using a 'Rick' voiceover, for my review. If approved, upload the videos to YouTube."
    },
    {
        id: '13',
        tags: ['GPT-4, wisper, generation'],
        image: '/assets/nft-dashboard-art-1.jpeg',
        price: '1.3 ETH',
        type: 'issue',
        owner: '@user2',
        title: 'Analtic for Uniswap',
        prompt: " Peruse Twitter posts daily for hashtags #WEB3 #Crypto and save them to my Notion account. Propose 10 topics for YouTube videos derived from these posts, and send them to me via Telegram. Upon receiving my preferences and topic choice, create a script for a 10-minute video in the style of Rick and Morty, complete with a catchy title and thumbnail. After my approval via Telegram, produce videos in English, Indonesian, and German using a 'Rick' voiceover, for my review. If approved, upload the videos to YouTube."
    },
    {
        id: '14',
        tags: ['GPT-4, wisper, generation'],
        image: '/assets/nft-dashboard-art-1.jpeg',
        price: '1.3 ETH',
        type: 'issue',
        owner: '@user2',
        title: 'Analtic for Uniswap',
        prompt: " Peruse Twitter posts daily for hashtags #WEB3 #Crypto and save them to my Notion account. Propose 10 topics for YouTube videos derived from these posts, and send them to me via Telegram. Upon receiving my preferences and topic choice, create a script for a 10-minute video in the style of Rick and Morty, complete with a catchy title and thumbnail. After my approval via Telegram, produce videos in English, Indonesian, and German using a 'Rick' voiceover, for my review. If approved, upload the videos to YouTube."
    },
];


function Item({ item, isOwner }) {
    return (

        <li className=" w-full lg:w-1/2 xl:w-1/3  p-1.5">
            <a
                className="flip block bg-zinc-900 rounded-md w-full overflow-hidden shadow-allSides"
                href="#items"
            >
                <div className='front flex flex-col'>
                    <h3 className="font-semibold text-lg  mb-2">{item.title}</h3>
                    <div
                        className="w-full h-40 bg-center bg-cover relative"
                        style={{ backgroundImage: `url(${item.image})` }}
                    >
                    </div>

                    <div className="flex items-center mt-2">
                        {item.tags.map((r, index) => {
                            const t = "#" + r
                            return <span className='text-blue-600' key={r + index}>{t}</span>
                        })}

                    </div>

                    <div className='flex items-center mt-2'>
                        <Image
                            className='mr-2'
                            priority
                            src={Aurelia}
                            height={32}
                            width={32}
                            alt="Follow us on Twitter"
                        />
                        <Image
                            className='mr-2'
                            priority
                            height={32}
                            width={32}
                            src={Airtable}
                            alt="Follow us on Twitter"
                        />
                        <Image
                            priority
                            className='mr-2'
                            height={32}
                            width={32}
                            src={Discord}
                            alt="Follow us on Twitter"
                        />
                        <Image
                            priority
                            className='mr-2'
                            height={32}
                            width={32}
                            src={Dynamodb}
                            alt="Follow us on Twitter"
                        />
                    </div>
                    <div className="flex items-center mt-2 justify-between">
                        <div className="flex text-zinc-400">

                            {item.owner}
                        </div>
                        <div className='flex'>

                            {item.price ? <span className="text-zinc-400">
                                Price: {item.price}
                            </span> : <span className="text-zinc-400">

                                {"Free"}
                            </span>}
                        </div>

                    </div>
                    <div className="flex mt-2  w-full" >

                        <button className="bg-gradient-to-tr from-fuchsia-600 to-violet-600  w-full rounded-md font-semibold h-12 p-px">
                            <div className="bg-zinc-800 w-full h-full rounded-md grid place-items-center">
                                {item.type === "issue" ? "Earn" : item.type === 'market' ? 'Buy' : 'Open'}
                            </div>
                        </button>
                    </div>

                </div>
                <div className="back h-full flex flex-col">
                    <div className="flex-grow overflow-auto">{item.prompt}</div>
                    <div className="mt-4">
                        <button className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 w-full rounded-md font-semibold h-12 p-px">
                            <div className="bg-zinc-800 w-full h-full rounded-md grid place-items-center">
                                {item.type === "issue" ? "Earn" : item.type === 'market' && !isOwner ? 'Buy' : 'Open'}
                            </div>
                        </button>
                    </div>
                </div>
            </a>
        </li>

    );
}


function Slider({ topFree, topMarket, topIssue, user }) {
    const [number, setNumber] = React.useState(1)
    const handleSlideChange = (number) => {
        setNumber(number);
    }
    return (
        <>
            <div className='top-16 z-20 underline  relative text-center text-xl font-extrabold'>{number === 0 ? "Top Free Workflows" : number === 2 ? "Top Market Workflows" : "Top most wanted forkflow to build"}</div>
            <Carousel slideInterval={10000} onSlideChange={handleSlideChange} indicators={false} className='bg-zinc-900 w-full h-full px-16 py-16'>

                <ul className="p-1.5 flex flex-wrap items-center justify-center">
                    {topFree.map((item) => <Item key={item.id} item={item} isOwner={user.name === item.owner} />)}
                </ul>


                <ul className="p-1.5 flex flex-wrap items-center justify-center">
                    {topMarket.map((item) => <Item key={item.id} item={item} isOwner={user.name === item.owner} />)}
                </ul>
                <ul className="p-1.5 flex items-center justify-center ">
                    {topIssue.map((item) => <Item key={item.id} item={item} isOwner={user.name === item.owner} />)}
                </ul>
            </Carousel>
        </>
    )
}