import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Socials from "@/components/socials";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

const page = () => {
  return (
    <div className='flex md:flex-row flex-col w-full h-scr2 items-center justify-center md:p-10 p-5 gap-5'>
      <div className='flex flex-col md:w-1/2 w-full md:h-full gap-6 md:p-5'>
        <div>
          <div className='heading'>Contact</div>
          <div className='font-thin'>Looking forward to hearing from you</div>
        </div>
        <div>
          <div className='sub-heading'>Phone</div>
          <div>
            <a href='tel:+61450243099' className='icons'>
              (+61) 45 024 3099
            </a>
          </div>
        </div>
        <div>
          <div className='sub-heading'>Email</div>
          <div>
            <a href='mailto:contact@syedbaqirali.com' className='icons'>
              contact@syedbaqirali.com
            </a>
          </div>
        </div>
        <div>
          <div className='sub-heading'>Follow Me</div>
          <div className='flex flex-row gap-3 py-3'>
            <Socials />
          </div>
        </div>
      </div>
      <form className='flex flex-row w-full h-full md:p-10 py-5 border border-slate-200 rounded-lg p-3'>
        <div className='flex flex-col w-full md:gap-10 gap-3'>
          <div className='flex flex-row w-full gap-5'>
            <div className='flex flex-col w-1/2 gap-2'>
              <Label htmlFor='firstname'>First Name *</Label>
              <Input id='firstname' placeholder='First Name' />
            </div>
            <div className='flex flex-col w-1/2 gap-2'>
              <Label htmlFor='lastname'>Last Name *</Label>
              <Input id='lastname' placeholder='Last Name' />
            </div>
          </div>
          <div className='flex flex-row w-full gap-5'>
            <div className='flex flex-col w-1/2 gap-2'>
              <Label htmlFor='email'>Email *</Label>
              <Input id='email' placeholder='Email' />
            </div>
            <div className='flex flex-col w-1/2 gap-2'>
              <Label htmlFor='subject'>Subject *</Label>
              <Input
                id='subject'
                placeholder='subject'
                defaultValue='Enquiry'
              />
            </div>
          </div>
          <div className='flex flex-row w-full gap-5'>
            <div className='flex flex-col w-full gap-2'>
              <Label htmlFor='message'>Message</Label>
              <Textarea
                id='message'
                placeholder='Type your message here.'
                rows={5}
              />
            </div>
          </div>
          <div className='flex flex-row w-full gap-5'>
            <div className='flex flex-col w-full gap-2'>
              <Button
                variant='outline'
                className='rounded-lg bg-amber-500 h-12 sub-heading border border-slate-800'
              >
                Submit
              </Button>
            </div>
          </div>
          {/* <div className='flex flex-col space-y-1.5'>
            <Label htmlFor='framework'>Framework</Label>
            <Select>
              <SelectTrigger id='framework'>
                <SelectValue placeholder='Select' />
              </SelectTrigger>
              <SelectContent position='popper'>
                <SelectItem value='next'>Next.js</SelectItem>
                <SelectItem value='sveltekit'>SvelteKit</SelectItem>
                <SelectItem value='astro'>Astro</SelectItem>
                <SelectItem value='nuxt'>Nuxt.js</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>
      </form>
    </div>
  );
};

export default page;
