import React from 'react';

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { signUpValidation } from '@/lib/validation';
import { z } from 'zod';
import Loader from '@/components/ui/shared/Loader';
import { Link, useNavigate } from 'react-router-dom';
// import { createUserAccount } from '@/lib/appwrite/api';
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from '@/lib/react-query/queriesAndMutation';
import { useUserContext } from '@/context/AuthContext';



const SignupForm = () => {

  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
  const navigate = useNavigate();


  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount()




  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: ""
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpValidation>) {
    const newUser = await createUserAccount(values);

    if (!newUser) {
      return toast({
        title: "SignUp failed, Please try again..."

      })
    }
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
        <h2 className='h3-bold md:h2-bold p-t5 sm:pt-12'>Create a new account</h2>
        <p className='text-light-3 small-medium md:base-regular'>To use Snapgram enter your details</p>


        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-2 flex-col gap-2 w-full mt-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className='shad-input'  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className='shad-input' placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />



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
            {isCreatingAccount ? (
              <div className='flex-center gap-2'>
                <Loader />Loading...

              </div>
            ) : "Sign Up"

            }

          </Button>

          <p className='text-small-regular text-light-2 text-center mt-2'>
            Already have an account?
            <Link to="/sign-in" className='text-primary-500 text-small-semibold ml-1' > Log in</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm



