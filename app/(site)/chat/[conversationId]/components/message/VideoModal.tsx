import Modal from '@/app/components/modal/Modal';
import LoadingModal from '@/app/components/modal/LoadingModal';

interface ConfirmModalProps {
    isOpen: boolean;
    url: string | null;
    onClose: () => void;
}

const VideoModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    url,
    onClose
}) => {
    
    return (
        <>
            {
                !url && isOpen &&
                <LoadingModal />
            }
            {
                url &&
                <Modal isOpen={isOpen} onClose={onClose}>
                    <video className="h-full w-full" autoPlay controls src={url}></video>
                </Modal>

            }
        </>
    )
}

export default VideoModal;
