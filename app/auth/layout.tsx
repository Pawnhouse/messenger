import Header from '../components/Header';

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {/* @ts-expect-error async component*/}
            <Header />
            <main className='flex-grow flex justify-items-stretch'>
                {children}
            </main>
        </>
    )
}