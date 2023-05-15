'use client';

import { useCallback, useState, useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import GmailButton from './GmailButton';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Variant = 'LOGIN' | 'REGISTER' | 'REGISTER2' | 'CONFIRM';


const AuthForm = () => {
    const session = useSession();
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [label, setLabel] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    useEffect(() => {
        if (session?.status === 'authenticated') {
            router.push('/');
        }
    }, [session?.status, router]);

    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN') {
            setVariant('REGISTER');
            setLabel('REGISTER');
        } else {
            setVariant('LOGIN');
            setLabel('LOGIN');
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        try {
            switch (variant) {
                case 'LOGIN':
                    await axios.post('/api/signin', data);
                    setVariant('CONFIRM');
                    break;
                case 'REGISTER':
                    setVariant('REGISTER2');
                    break;
                case 'REGISTER2':
                    if (data.password !== data.passwordRepeat) {
                        throw { response: { data: 'Passwords don\'t match' } }
                    }
                    await axios.post('/api/register', data);
                    setVariant('CONFIRM');
                    break;
                case 'CONFIRM':
                    const callback = await signIn('credentials', { ...data, redirect: false });
                    if (callback?.error) {
                        throw { response: { data: 'Incorrect code' } }
                    }
                    if (callback?.ok && !callback?.error) {
                        router.push('/');
                    }
            }
        } catch (err: any) {
            toast.error(err?.response?.data || 'Server error');
        } finally {
            setIsLoading(false);
        }
    }

    const googleLogin = () => {
        setIsLoading(true);

        signIn('google', { redirect: false })
            .then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid credentials!');
                }
                if (callback?.ok && !callback?.error) {
                    toast.success('');
                }
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <>
            <h2 className='
                mt-6 
                text-center 
                text-3xl 
                font-bold 
                tracking-tight 
                text-gray-900
                '
            >
                {
                    label === 'LOGIN' ?
                        'Sign in to continue' :
                        'Registration'
                }
            </h2>

            <div className='mt-8 sm:mx-auto sm:w-72 sm:max-w-md'>
                <div className='bg-white px-8 py-4 shadow sm:rounded-lg sm:px-10'>

                    <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
                        {
                            variant === 'LOGIN' &&
                            <>
                                <Input label='Email' id='email' register={register} errors={errors} />
                                <Input label='Password' id='password' register={register} errors={errors} type='password' />
                                <a href='#' className='font-normal text-gray-400 hover:text-gray-600 text-xs'>
                                    Forgot password?
                                </a>
                            </>
                        }
                        {
                            variant === 'REGISTER' &&
                            <>
                                <Input label='First name' id='firstName' register={register} errors={errors} />
                                <Input label='Middle name' id='middleName' register={register} errors={errors} />
                                <Input label='Surname' id='surname' register={register} errors={errors} />
                                <Input label='Birthday' id='birthday' register={register} errors={errors} type='date' />
                            </>
                        }
                        {
                            variant === 'REGISTER2' &&
                            <>
                                <Input label='Username' id='username' register={register} errors={errors} />
                                <Input label='Email' id='email' register={register} errors={errors} type='email' />
                                <Input label='Password' id='password' register={register} errors={errors} type='password' />
                                <Input label='Repeat password' id='passwordRepeat' register={register} errors={errors} type='password' />
                            </>
                        }
                        {
                            variant === 'CONFIRM' &&
                            <>
                                <Input label='Code' id='oneTimePassword' register={register} errors={errors} />
                            </>
                        }

                        <div>
                            <Button disabled={isLoading} fullWidth type='submit'>
                                Continue
                            </Button>
                            {
                                variant === 'LOGIN' &&
                                <>
                                    <span className='
                                    mt-8 
                                    block 
                                    text-sm 
                                    font-medium 
                                    leading-6 
                                    text-gray-900
                                '>Sign in with Google</span>
                                    <GmailButton onClick={googleLogin}></GmailButton>
                                </>
                            }
                            {
                                (variant === 'REGISTER' || variant === 'LOGIN') &&
                                <div className='font-normal text-gray-400 hover:text-gray-600 text-xs'>
                                    {variant === 'LOGIN' ? 'Don\'t have an account? ' : 'Already have an account? '}
                                    <span
                                        onClick={toggleVariant}
                                        className='underline cursor-pointer'
                                    >
                                        {variant === 'LOGIN' ? 'Sign up' : 'Sign in'}
                                    </span>
                                </div>
                            }

                        </div>
                    </form>
                </div>
            </div>
        </>

    );
}

export default AuthForm;