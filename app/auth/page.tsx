import AuthForm from './components/AuthForm'

export default function Home() {
  return (<>

    <div
      className='
        flex-grow
        flex
        top-0
        bottom-0
        flex-col
        justify-center
        py-12
        sm:px-6
        lg:px-8
        bg-gray-100
      '
    >
      <div className='sm:mx-auto' >
        <AuthForm />
      </div>

    </div>
    
  </>
  )
}
