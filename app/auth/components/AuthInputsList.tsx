import Input from '@/app/components/Input'
import { Variant } from './AuthForm'
import {
    FieldErrors,
    FieldValues,
    UseFormRegister
} from 'react-hook-form';
import { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

interface AuthInputsListProps {
    variant: Variant
    register: UseFormRegister<FieldValues>,
    errors: FieldErrors
}

const AuthInputsList: React.FC<AuthInputsListProps> = ({
    variant,
    register,
    errors,
}) => {

    const [isHidden, setIsHidden] = useState(true)

    return (
        <>
            {
                variant === 'LOGIN' &&
                <>
                    <Input label='Email' id='loginEmail' register={register} errors={errors} />
                    <div className='w-full relative'>
                        <Input label='Password' id='loginPassword' register={register} errors={errors} type={isHidden ? 'password' : 'text'} />
                        <div className='absolute right-3 bottom-2 text-gray-700 text-lg'>
                            {
                                isHidden ?
                                    <AiFillEye onClick={() => setIsHidden(false)} /> :
                                    <AiFillEyeInvisible onClick={() => setIsHidden(true)} />
                            }
                        </div>
                    </div>
                    {/* <a href='#' className='font-normal text-gray-400 hover:text-gray-600 text-xs'>
                        Forgot password?
                    </a> */}
                </>
            }
            {
                variant === 'REGISTER' &&
                <>
                    <Input label='First name' id='firstName' register={register} errors={errors} required />
                    <Input label='Middle name' id='middleName' register={register} errors={errors} />
                    <Input label='Surname' id='surname' register={register} errors={errors} required />
                    <Input label='Birthday' id='birthday' register={register} errors={errors} type='date' />
                </>
            }
            {
                variant === 'REGISTER2' &&
                <>
                    <Input label='Username' id='username' register={register} errors={errors} required />
                    <Input label='Email' id='email' register={register} errors={errors} type='email' required />
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
        </>
    )
}
export default AuthInputsList