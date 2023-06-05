'use client';

import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';
import axios from 'axios';
import Button from '@/app/components/Button';
import { useState } from 'react';
import Input from '../components/Input';
import Image from 'next/image';
import { User } from '@prisma/client';
import { toast } from 'react-hot-toast';

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

    console.log({
        ...user,
        birthday: dateToString(user.birthday || new Date())
    })

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setValue('message', '', { shouldValidate: true }); console.log(data);
        setSubmitEnabled(false);
        axios.post('/api/profile', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(res => { console.log(res); 
            toast.success(res.data || 'Saved')
        }).catch((error) =>
            toast.error(error.data || 'Server error')
        ).finally(() => {
            setSubmitEnabled(true)
            reset({ picture: null, password: '', passwordRepeat: '' })
        });
    }

    return (

        <form onSubmit={handleSubmit(onSubmit)}
            className='
                grid 
                grid-cols-1 
                max-w-2xl 
                md:grid-cols-2
                px-2
                gap-5
                gap-x-10

        '>
            <div className='flex flex-col gap-2'>
                <Image
                    width={300}
                    height={300}
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
                    <select id="theme" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1.5 px-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="usual">Usual</option>
                    </select>
                </div>

            </div>
            <div className='flex flex-col gap-2'>
                <Input label='Email' id='email' register={register} errors={errors} type='email' />
                <Input label='Password' id='password' register={register} errors={errors} type='password' />
                <Input label='Repeat password' id='passwordRepeat' register={register} errors={errors} type='password' />
            </div>
            <div className='p-2'>
                <Button round type='submit' disabled={!submitEnabled && false}>Save</Button>

            </div>

        </form>

    );
}

export default ProfileForm;