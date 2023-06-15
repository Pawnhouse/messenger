'use client';

import { useCallback, useState, useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Button from '@/app/components/Button';
import GmailButton from './GmailButton';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthInputsList from './AuthInputsList';
import LoadingModal from '@/app/components/modal/LoadingModal';

export type Variant = 'LOGIN' | 'REGISTER' | 'REGISTER2' | 'CONFIRM';

type myError = { response: { data: string } };

const AuthForm = () => {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [label, setLabel] = useState<Variant>('LOGIN');
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
  } = useForm<FieldValues>();

  const authenticateCredentials = async (data: FieldValues,) => {
    const callback = await signIn('credentials', { ...data, redirect: false });
    if (callback?.error) {
      throw { response: { data: 'Incorrect code' } }
    }
    router.refresh();
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (label === 'LOGIN') {
      data = {
        ...data,
        password: data.loginPassword,
        email: data.loginEmail
      }
    }

    try {
      switch (variant) {
        case 'LOGIN':
          if (process.env.EMAIL_VERIFICATION === 'verify') {
            await axios.post('/api/signin', data);
            setVariant('CONFIRM');
            toast('A confirmation code has been sent to your email')

          } else {
            await authenticateCredentials(data);
          }
          break;
        case 'REGISTER':
          setVariant('REGISTER2');
          break;
        case 'REGISTER2':
          if (data.password !== data.passwordRepeat) {
            throw { response: { data: 'Passwords don\'t match' } }
          }
          await axios.post('/api/register', data);

          if (process.env.EMAIL_VERIFICATION === 'verify') {
            setVariant('CONFIRM');
            toast('A confirmation code has been sent to your email')

          } else {
            await authenticateCredentials(data);
          }
          break;
        case 'CONFIRM':
          await authenticateCredentials(data);
      }
    } catch (err) {
      toast.error((err as myError)?.response?.data || 'Server error');

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
      {
        isLoading &&
        <LoadingModal />
      }

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
            <AuthInputsList variant={variant} errors={errors} register={register} />
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

          </form>
        </div>
      </div>
    </>

  );
}

export default AuthForm;
