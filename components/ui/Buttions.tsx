import { FC } from 'react'


const ButtionBlack = ({ children }) => {
    return <div class="group relative">
        <div class="absolute -inset-1 rounded-lg bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 opacity-75 blur transition duration-500 group-hover:opacity-100"></div>
        <button class="relative rounded-lg bg-black px-7 py-4 text-white">{children}</button>
    </div>
}

export default Buttions