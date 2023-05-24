'use client';

import useConversation from '@/app/hooks/useConversation';
import useRoutes from '@/app/hooks/useRoutes';
import MobileItem from './MobileItem';
import { User } from '@prisma/client';
import { usePathname } from 'next/navigation';

interface MobileFooterProps {
  user: User | null;
}

const MobileFooter = ({user}: MobileFooterProps) => {
  const routes = useRoutes();
  const pathname = usePathname();
  const { isOpen } = useConversation();
  if (isOpen) {
    return null;
  }

  return ( 
    <div 
      className='
        justify-between 
        w-full 
        flex 
        items-center 
        bg-white 
        border-t-[1px] 
        lg:hidden
      '
    >
      {routes.map((route) => (
        <MobileItem 
          key={route.href} 
          href={route.href} 
          active={route.active} 
          icon={route.icon}
          onClick={route.onClick}
        />
      ))}
        <MobileItem 
          href='#' 
          active={pathname==='/profile'} 
          user={user}
        />     
    </div>
   );
}
 
export default MobileFooter;