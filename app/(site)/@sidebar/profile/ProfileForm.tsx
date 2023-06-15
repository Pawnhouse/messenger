'use client';

import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';
import axios from 'axios';
import Button from '@/app/components/Button';
import { useState, useEffect } from 'react';
import Input from '@/app/components/Input';
import Image from 'next/image';
import { User } from '@prisma/client';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type Subscription = 'subscribed' | 'unsubscribed' | 'processing'

function dateToString(date: Date): string {
    const mm = date.getMonth() + 1;
    const dd = date.getDate();

    return [date.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('-');
}

const ProfileForm = ({ user }: { user: User }) => {
    const [submitEnabled, setSubmitEnabled] = useState(false);
    const [subscription, setSubscription] = useState<Subscription>('processing')
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            ...user,
            birthday: dateToString(user.birthday || new Date())
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setValue('message', '', { shouldValidate: true });
        setSubmitEnabled(false);
        axios.post('/api/profile', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(res => {
            toast.success(res.data || 'Saved')
        }).catch((error) =>
            toast.error(error.data || 'Server error')
        ).finally(() => {
            setSubmitEnabled(true)
            reset({ picture: null, password: '', passwordRepeat: '' })
        });
    }

    useEffect(() => {
        axios.get('/api/profile/subscription').then((response) => {
            if (response.data === 'subscribed') {
                setSubscription('subscribed')
            } else if (response.data !== 'processing') {
                setSubscription('unsubscribed')
            }
        }).catch(() => undefined)
    }, [])

    const onSubscription = () => {
        setSubscription('processing')
        axios.post('/api/profile/subscription')
            .then(response => router.push(response.data as string))
            .catch((error) => toast.error(error.data || 'Server error'))
    }

    return (
        <>
            <div className='
                text-2xl 
                font-bold 
                text-neutral-800 
                py-4
            '>
                Profile
            </div>

            <form onSubmit={handleSubmit(onSubmit)}
                className='
                grid 
                grid-cols-1 
                max-w-xl 
                md:grid-cols-2
                px-2
                gap-5
            '>

                <div className='flex flex-col gap-2 justify-between'>
                    <Image
                        width={250}
                        height={250}
                        src={user?.image || '/standard.jpg'}
                        alt='Avatar'
                    />
                    <Input id='picture' label='Profile picture' type='file' register={register} errors={errors} />
                </div>

                <div className='flex flex-col gap-2 justify-between'>
                    <Input label='First name' id='firstName' register={register} errors={errors} />
                    <Input label='Middle name' id='middleName' register={register} errors={errors} />
                    <Input label='Surname' id='surname' register={register} errors={errors} />
                    <Input label='Birthday' id='birthday' register={register} errors={errors} type='date' />
                    <Input label='Username' id='username' register={register} errors={errors} />
                </div>

                <div className='flex flex-col gap-2'>
                    <div>
                        <label htmlFor="theme" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Theme</label>
                        <select disabled={subscription !== 'subscribed'} id="theme" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1.5 px-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="usual">Usual</option>
                        </select>
                    </div>
                    <div className='w-24 flex flex-col'>
                        <Button round disabled={subscription !== 'unsubscribed'} onClick={onSubscription}>Subscribe</Button>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <Input label='Email' id='email' register={register} errors={errors} type='email' />
                    <Input label='Password' id='password' register={register} errors={errors} type='password' />
                    <Input label='Repeat password' id='passwordRepeat' register={register} errors={errors} type='password' />
                </div>

                <div className='w-24 flex flex-col'>
                    <Button round type='submit' disabled={!submitEnabled && false}>Save</Button>
                </div>

            </form>
        </>
    );
}

export default ProfileForm;