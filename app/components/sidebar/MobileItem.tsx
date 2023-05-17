import Link from 'next/link';

import clsx from 'clsx';
import { User } from '@prisma/client';
import Avatar from '../Avatar';

interface MobileItemProps {
  href: string;
  icon?: any;
  active?: boolean;
  onClick?: () => void;
  user?: User | null;
}

const MobileItem: React.FC<MobileItemProps> = ({ 
  href, 
  icon: Icon, 
  active,
  onClick,
  user
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return ( 
    <Link 
      onClick={handleClick} 
      href={href} 
      className={clsx(`
        group 
        flex 
        gap-x-3 
        text-sm 
        leading-6 
        font-semibold 
        w-full 
        justify-center 
        p-4 
        text-gray-500 
        hover:text-black 
        hover:bg-gray-100
      `,
        active && 'bg-gray-100 text-black',
      )}>
        {
          user &&
          <Avatar user={user} />
        }
        {
          Icon &&
          <Icon className='h-6 w-6' />

        }
    </Link>
   );
}
 
export default MobileItem;