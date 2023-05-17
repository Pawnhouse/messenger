'use client';

import { signOut } from "next-auth/react"
import Link from "next/link"
import { HiArrowLeftOnRectangle } from "react-icons/hi2"

const LogOutLink = () => {
    return (
        <Link href='/auth' onClick={() => signOut()} className='
                    flex 
                    flex-col
                    justify-center
                    rounded-md 
                    px-3 
                    font-semibold 
                    text-gray-500 
                    hover:text-black 
                '>
                    <HiArrowLeftOnRectangle className='h-6 w-6 shrink-0' aria-hidden='true' />
                    <span className='sr-only'>Log out</span>
                </Link>
    )
}

export default LogOutLink
