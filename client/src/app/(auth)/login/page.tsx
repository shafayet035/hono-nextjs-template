'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { LoginFormValues, LoginSchema } from '../validation';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const { isAuthenticated, login, isLoading, error } = useAuthStore();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        await login(data);
    };

    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, isLoading, router]);

    return (
        <div className='w-full max-w-[500px] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='w-full'>
                <div className='mb-8 text-center'>
                    <h2 className='text-3xl font-extrabold'>Login Form</h2>
                    <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>Login to your account</p>
                </div>

                <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6'>
                    <Form {...form}>
                        {error && <p className='text-red-500 text-sm text-center pb-3'>{error}</p>}
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type='email' placeholder='your@email.com' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type='password' placeholder='••••••••' {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type='submit' className='w-full' disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Logging in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>

                <div className='py-5'>
                    <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
                        Don&apos;t have an account?{' '}
                        <Link href='/register' className='text-primary font-medium'>
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
