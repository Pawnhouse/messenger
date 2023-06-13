import getCurrentUser from './actions/getCurrentUser'
import Header from './components/Header'
import MobileFooter from './components/sidebar/MobileFooter'
import AuthContext from './context/AuthContext'
import ToasterContext from './context/ToasterContext'
import './globals.css'

export const metadata = {
  title: 'Messenger',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser();

  return (
    <html lang='en'>
      <body>
        <AuthContext>
          <ToasterContext />
          <div className='flex flex-col h-full w-full'>

            <Header user={user} />
            <main className='flex-grow flex justify-items-stretch h-[300px]'>
              {children}
            </main>
            <MobileFooter user={user} />
            <div className='p-0.5 bg-gray-200  '>
              <span className=' ml-3 text-xs'>E2E © 2023</span>
            </div>

          </div>
        </AuthContext>
      </body>
    </html>
  )
}
