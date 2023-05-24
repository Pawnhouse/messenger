import Input from '@/app/components/Input'
import { Variant } from './AuthForm'
import {
    FieldErrors,
    FieldValues,
    UseFormRegister
} from 'react-hook-form';

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

    switch (variant) {
        case 'LOGIN':
            return (
                <>
                    <Input label='Email' id='email' register={register} errors={errors} />
                    <Input label='Password' id='password' register={register} errors={errors} type='password' />
                    <a href='#' className='font-normal text-gray-400 hover:text-gray-600 text-xs'>
                        Forgot password?
                    </a>
                </>
            )
        case 'REGISTER':
            return (
                <>
                    <Input label='First name' id='firstName' register={register} errors={errors} />
                    <Input label='Middle name' id='middleName' register={register} errors={errors} />
                    <Input label='Surname' id='surname' register={register} errors={errors} />
                    <Input label='Birthday' id='birthday' register={register} errors={errors} type='date' />
                </>

            )
        case 'REGISTER2':
            return (
                <>
                    <Input label='Username' id='username' register={register} errors={errors} />
                    <Input label='Email' id='email' register={register} errors={errors} type='email' />
                    <Input label='Password' id='password' register={register} errors={errors} type='password' />
                    <Input label='Repeat password' id='passwordRepeat' register={register} errors={errors} type='password' />
                </>
            )
        case 'CONFIRM':
            return (
                <>
                    <Input label='Code' id='oneTimePassword' register={register} errors={errors} />
                </>
            )
    }
}
export default AuthInputsList