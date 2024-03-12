import React from 'react';

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import {signinValidation } from '@/lib/validation';
import { z } from 'zod';
import Loader from '@/components/ui/shared/Loader';
import { Link, useNavigate } from 'react-router-dom';
// import { createUserAccount } from '@/lib/appwrite/api';
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from '@/lib/react-query/queriesAndMutation';
import { useUserContext } from '@/context/AuthContext';



const SigninForm = () => {

  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
  const navigate = useNavigate();


  
  const { mutateAsync: signInAccount} = useSignInAccount()




  const form = useForm<z.infer<typeof signinValidation>>({
    resolver: zodResolver(signinValidation),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signinValidation>) {
   
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (!session) {
      return toast({ title: 'Sign in failed. Please try again.' })
    }

    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();

      navigate('/')
    } else {
      return toast({ title: 'SignUp in failed, please try again' })
    }

  }




  return (


    <Form {...form}>
      <div className='  sm:w-420  flex-center flex-col'>
        <img src="/assets/images/logo.svg" alt="" />
        <h2 className='h3-bold md:h2-bold p-t5 sm:pt-12'>Sign in to your account</h2>
        <p className='text-light-3 small-medium md:base-regular'>Welcome back, please enter your details</p>


        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-2 flex-col gap-2 w-full mt-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className='shad-input' placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />




          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className='shad-input' placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />



          <Button className='shad-button_primary w-full ' type="submit">
            {isUserLoading ? (
              <div className='flex-center gap-2'>
                <Loader />Loading...

              </div>
            ) : "Sign In"

            }

          </Button>

          <p className='text-small-regular text-light-2 text-center mt-2'>
           Don't have an account?
            <Link to="/sign-up" className='text-primary-500 text-small-semibold ml-1'>Sign Up</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm



