'use client'
import { SandwichIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error
    reset: () => void
}) {
    const router = useRouter()
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (

        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-gray-900 flex flex-col items-center justify-center p-5">
            <div className='flex max-w-xl items-center justify-center flex-col'>
                <h2 className="text-4xl text-white font-extrabold text-center">Something went wrong!</h2>
                <p className="text-xl text-gray-400 mt-5">{error.message || ""}</p>
                <div className="flex justify-between w-full mt-20">
                    <button
                        className="text-center font-bold w-1/2 select-none items-center outline-none focus-visible:ring-4 bg-purple-500 hover:bg-purple-700 rounded h-[36px] whitespace-nowrap text-sm transition ml-2 cursor-pointer"
                        onClick={router.back}
                    >
                        <span className="select-none font-bold" >Back</span>
                    </button>
                    <button
                        className="text-center font-bold w-1/2 select-none items-center outline-none focus-visible:ring-4 bg-purple-500 hover:bg-purple-700 rounded h-[36px] whitespace-nowrap text-sm transition ml-2 cursor-pointer"
                        onClick={reset}
                    >
                        Reset
                    </button>

                </div>
            </div>
        </div>



    )
}