"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldPath, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Icons from "@/components/Icons";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

async function dologin(formData: z.infer<typeof formSchema>) {
  console.log("Here...");
  toast(JSON.stringify(formData));
}

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <main className='flex flex-col w-full items-center h-full py-3 px-2'>
      <section className='flex flex-col w-full justify-start gap-1 p-2 bg-stone-100 rounded-t-lg'>
        <div className='text-lg font-semibold'>Login</div>
      </section>
      <Form {...form}>
        <form
          className='space-y-4 w-full p-3'
          onSubmit={form.handleSubmit(dologin)}
        >
          <LoginFormField
            name='email'
            label='Email'
            placeholder='Email'
            inputType='email'
            formControl={form.control}
          />
          <LoginFormField
            name='password'
            label='Password'
            placeholder='Password'
            inputType='password'
            formControl={form.control}
          />
          <div className='flex justify-end'>
            <Button type='submit' className='bg-amber-500'>
              <Icons.User /> Login
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}

interface LoginFormFieldProps {
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: string;
  readonly?: boolean;
  defaultValue?: string | number | readonly string[] | undefined;
  formControl: Control<z.infer<typeof formSchema>, unknown>;
}

const LoginFormField: React.FC<LoginFormFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  readonly,
  formControl,
}) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className=' w-full'>
          {inputType != "hidden" && (
            <FormLabel className='ml-1 font-semibold'>{label}</FormLabel>
          )}
          <FormControl>
            <Input
              className='input-field w-full'
              placeholder={placeholder}
              type={inputType || "text"}
              readOnly={readonly}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
