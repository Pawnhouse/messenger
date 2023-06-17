import { IoClose } from 'react-icons/io5';

interface FileInputProps {
    name: string;
    onClose: () => void;
}

const FileInput: React.FC<FileInputProps> = ({
    name,
    onClose
}) => {

    return (
        <div className='
            w-full 
            text-black
            font-light
            py-2
            px-4
            bg-neutral-100 
            rounded-full
            focus:outline-none
        '>
            <div className='flex bg-gray-200 items-center w-fit pl-2 pr-1 rounded'>
            <span className='max-w-[200px] truncate'>
                {name}
            </span>
            <IoClose onClick={onClose} className='ml-1 cursor-pointer mr-0' />

            </div>
        </div>
    );
}

export default FileInput;