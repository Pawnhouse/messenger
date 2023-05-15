import Image from 'next/image';

export default function Header() {

    const name = 'User';
    return (
        <header className='p-1 h-10 bg-gray-200 flex justify-center sm:justify-normal'>
            <Image alt='logo' height={40} width={40} src='logo.svg' className='mx-10' priority={true} />
            {/* <div className=''>
                Hello, {name}

            </div> */}
        </header>
    )
}