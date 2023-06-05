const ProfileDrawerItem = ({ name, value, hr }: { name: string, value: string | null | undefined, hr?: boolean }) => {
    if (!value) {
        return null;
    }

    return (
        <>
            {hr &&
                <hr />
            }
            <div>
                <dt
                    className='
                    text-sm 
                    font-medium 
                    text-gray-500 
                    sm:w-40 
                    sm:flex-shrink-0
                '
                >
                    {name}
                </dt>
                <dd
                    className='
                    mt-1 
                    text-sm 
                    text-gray-900 
                    sm:col-span-2
                '
                >
                    {value}
                </dd>
            </div>
        </>
    )
}

export default ProfileDrawerItem