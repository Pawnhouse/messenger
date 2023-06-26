'use client'

import useConversation from '@/app/hooks/useConversation';
import clsx from 'clsx';
import { usePathname } from 'next/navigation'


export default function SidebarLayout({ children }: {
    children: React.ReactNode
}) {
    const isProfile = usePathname() === '/profile';
    const { isOpen } = useConversation();

    return (
        <div className={clsx(`
                lg:block
                overflow-y-auto 
                border-r 
                border-gray-200 
            `,
            isOpen ? 'hidden' : 'w-full',
            isProfile ? 'px-3 lg:max-w-xl' : 'lg:w-80'
        )}>
            {children}
        </div>
    )
}
