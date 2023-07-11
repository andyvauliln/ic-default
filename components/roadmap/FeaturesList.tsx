//@ts-nocheck
"use client"
import Spinner from '@/components/ui/Spinner';
import { getURL, postData } from '@/utils/helpers';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Backpack, Rocket, TerminalSquare } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';


export default function FeaturesList() {

    const {
        isFetching,
        data: result = [],
        refetch,
        isFetched,
        isError,
        error
    } = useQuery({
        queryFn: async () => {
            const response = await fetch("/api/notion/features/get-pages", {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                credentials: 'same-origin',
                body: JSON.stringify({})
            })
            return response.json();

        },
        queryKey: ['get-project-features'],
    })

    return (
        <div className="flex w-full flex-col px-4">
            <div className="px-2">
                <h1 className="py-3 pt-12 text-4xl font-extrabold lg:text-6xl">Roadmap</h1>
                <p className="mb-10 pt-2 text-base text-gray-300" >Upvote or comment existing ideas.
                </p>
                <hr className="w-full border-b border-zinc-600" />
            </div>
            {!isFetching ? <>
                <div className="flex items-center px-2 mt-6">
                    <TerminalSquare size={22} className="text-purple-500" />
                    <div className="ml-2 text-lg font-semibold opacity-80 text-purple-500">In Progress</div>
                </div>
                <div className="flex-1">
                    {result.data.filter(r => r.status === "In Process").map((r, idx) => {
                        return (<Row key={r.id} idx={idx} page={r} />
                        )
                    })}
                </div>
                <div className="flex items-center px-2 border-t pt-4 border-zinc-600">
                    <Rocket size={22} className="text-purple-500" />
                    <div className="ml-2 text-lg font-semibold text-purple-500 opacity-80">Planed</div>
                </div>
                <div className="flex-1">
                    {result.data.filter(r => r.status === "Planned").map((r, idx) => {
                        return (<Row key={r.id} idx={idx} page={r} />
                        )
                    })}
                </div>
                <div className="flex items-center px-2  border-t border-zinc-600 pt-4">
                    <Backpack size={22} className="text-purple-500" />
                    <div className="ml-2 text-lg font-semibold text-purple-500 opacity-80">Backlog</div>
                </div>
                <div className="flex-1">
                    {result.data.filter(r => r.status === "Backlog").map((r, idx) => {
                        return (<Row key={r.id} idx={idx} page={r} />
                        )
                    })} </div>
            </> : <div className='w-full h-[10rem] flex items-center justify-center'> <Spinner /> </div>}
        </div>
    );
};

function Row({ idx, page }) {
    const [comment, setComment] = useState("");
    const [isActive, setIsActive] = useState(false);

    const handleCommentInput = (event) => {
        setComment(event.target.value);
    };
    const handleCommentClick = (event) => {
        updatePage({ comment, page_id: page.id });
    };
    const handleVoteClick = (event) => {
        page.vote += 1;
        updatePage({ vote: true, page_id: page.id });
    };

    const { mutate: updatePage, isLoading } = useMutation({
        mutationFn: async (data) => {
            console.log('data', data);
            const url = `${getURL("api/notion/features/update-page")}`;
            await postData({ url, data })

        },
        onError: (err) => {
            toast.error("Error", {
                description: 'Could not update feature(',
            })
        },
        onSuccess: () => {
            toast.success("Success", {
                description: 'Thank you for your opinion',
            })
        },
    })

    return <div key={idx} className="group flex flex-col border-b border-zinc-600 py-4 px-2 last:border-b-0">
        <div className="flex items-center justify-between">
            <div onClick={e => setIsActive(!isActive)} className="flex-grow text-left font-extrabold cursor-pointer">{page.name}</div>
            <button className="px-4 py-2 rounded bg-zinc-800 text-purple-500 font-bold" onClick={handleVoteClick}>
                <span className="mr-2" >▲</span>{page.vote}
            </button>
        </div>
        {isActive && <div className="my-4">
            <p className="mt-1 text-left text-base text-gray-300 break-words overflow-wrap">
                {page.description}
            </p>
            <div className="flex items-center mt-4">
                <input
                    type="text"
                    name="comment"
                    placeholder="Comment..."
                    className="h-[36px] flex-grow rounded p-2 bg-zinc-900"
                    value={comment}
                    onChange={handleCommentInput}
                />
                {!isLoading ? <button
                    className="relative flex items-center justify-center gap-2 px-3 py-2 outline-none focus-visible:ring-4 bg-purple-600 hover:bg-purple-700 rounded h-[36px] whitespace-nowrap text-sm transition ml-2 cursor-pointer"
                    onClick={handleCommentClick}
                >
                    <span className="select-none font-bold" >Comment</span>
                </button> : <Spinner className="ml-2" />}
            </div>
        </div>}
    </div>
}

