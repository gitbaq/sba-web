import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  //   SheetClose,
  SheetContent,
  SheetDescription,
  //   SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Icons from "./Icons";

export default function Subscribe() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline'>
          Join! <Icons.Mail className='text-amber-600' />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className='flex flex-row gap-3'>
              Join Mailing List <Icons.Mail className='text-amber-500' />
            </div>
          </SheetTitle>
          <SheetDescription>
            Enter your details below to join mailing list. Click Join when
            you`re done.
          </SheetDescription>
        </SheetHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input
              id='name'
              type='text'
              placeholder='Happy II Learn'
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='email' className='text-right'>
              Email
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='email@email.com'
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 gap-4'>
            <div className='cols-span-1'>&nbsp;</div>
            <Button type='submit' className='col-span-3 bg-amber-500'>
              Join
            </Button>
          </div>
        </div>
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type='submit' className='w-3/4 bg-amber-500'>
              Join
            </Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
