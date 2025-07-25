import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
import React from 'react'
import Icons from './Icons';
import { useSidebar } from './ui/sidebar';

const NavbarTrigger = () => {
    const { toggleSidebar } = useSidebar();
  return (
    <Tooltip>
      <TooltipContent
        className='border border-accent bg-transparent text-primary bg-opacity-70'
        side='bottom'
      >
        Toggle Sidebar
      </TooltipContent>
      <TooltipTrigger>
        <Icons.Menu
          onClick={toggleSidebar}
          className='hover:cursor-pointer border-none icons-size-lg'
        />
      </TooltipTrigger>
    </Tooltip>
  );
}

export default NavbarTrigger