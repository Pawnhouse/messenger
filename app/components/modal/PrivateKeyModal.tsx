'use client';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';
import { User } from '@prisma/client';

import Modal from './Modal';
import Button from '../Button';
import Input from '../Input';
import { signOut } from 'next-auth/react';
import generateUserKey from '@/app/libs/cryptography/generateUserKey';
import { toast } from 'react-hot-toast';
import { createECDH } from 'crypto';

interface PrivateKeyModalProps {
    isOpen?: boolean;
    currentUser: User;
    onClose: () => void;
}

const PrivateKeyModal: React.FC<PrivateKeyModalProps> = ({
    isOpen,
    currentUser,
    onClose
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>();

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        try {
            const cipher = createECDH('secp256k1');
            cipher.setPrivateKey(data.privateKey, 'base64');
            if (currentUser.publicKey !== cipher.getPublicKey('base64')) {
                throw new Error()
            }

        } catch {
            toast.error('Invalid key');
            setIsLoading(false);
            return;
        }
        localStorage.setItem('ECDH_Private_Key_' + currentUser.id, data.privateKey)
        onClose();
        router.refresh();
    }

    const onGenerate = () => {
        generateUserKey(currentUser, () => {
            onClose();
            router.refresh();
        });
        setIsLoading(true)

    }

    return (
        <Modal isOpen={isOpen} onClose={() => undefined} unskippable>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='space-y-12'>
                    <div className='border-b border-gray-900/10 pb-8'>
                        <h2
                            className='
                                text-base 
                                font-semibold 
                                leading-7 
                                text-gray-900
                            '
                        >
                            Private Key missing
                        </h2>
                        <p className='mt-1 text-sm leading-6 text-gray-600'>
                            Private key is not saved in your local storage. Provide your private key for correct work.
                            <br />
                            New key generation will lead to <b>data and access loss</b>.
                        </p>

                        <div className='mt-6'>
                            <Input
                                disabled={isLoading}
                                label='privateKey'
                                id='privateKey'
                                errors={errors}
                                required
                                register={register}
                            />

                        </div>
                    </div>
                </div>
                <div className='mt-3 flex items-center justify-end gap-x-6'>
                    <Button
                        disabled={isLoading}
                        onClick={onGenerate}
                        type='button'
                        danger
                    >
                        Generate new key
                    </Button>
                    <div className='flex-grow' />
                    <Button
                        onClick={() => signOut()}
                        type='button'
                        secondary
                    >
                        Sign out
                    </Button>
                    <Button disabled={isLoading} type='submit'>
                        Save key
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default PrivateKeyModal;