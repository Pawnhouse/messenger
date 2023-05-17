'use client';


import { User } from "@prisma/client";

import UserItem from "./UserItem";

interface UserSidebarProps {
  items: User[];
}

const UserList: React.FC<UserSidebarProps> = ({ 
  items, 
}) => {
  return ( 
    <aside 
      className="
        ml-20
        w-full
        lg:w-80 
        overflow-y-auto 
        border-r 
        border-gray-200
      "
    >
      <div className="px-5">
        <div className="flex-col">
          <div 
            className="
              text-2xl 
              font-bold 
              text-neutral-800 
              py-4
            "
          >
            People
          </div>
        </div>
        {items.map((item) => (
          <UserItem
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </aside>
  );
}
 
export default UserList;