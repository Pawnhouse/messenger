import Header from "../Header";
import getCurrentUser from "../actions/getCurrentUser";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {/* @ts-expect-error */}
            <Header />
            <main className='flex-grow flex justify-items-stretch'>
                {children}
            </main>
        </>
    )
}