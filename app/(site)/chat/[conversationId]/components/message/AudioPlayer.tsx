import { Howl } from 'howler';
import { useEffect, useMemo, useState, MouseEventHandler, useRef } from 'react';
import { IoPause, IoPlay } from 'react-icons/io5';

interface AudioPlayerProps {
    fileUrl: string
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
    fileUrl
}) => {
    const [seek, setSeek] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false);
    const [startTime, setStartTime] = useState(new Date())
    const [pauseSeek, setPauseSeek] = useState(0);
    const [duration, setDuration] = useState(0);

    const sound = useMemo(() => new Howl({
        src: [fileUrl || ''],
        format: 'mp3',
        onend: () => { setIsPlaying(false); setPauseSeek(0) },
        onload: () => { setDuration(soundRef.current.duration()); }
    }), [fileUrl]);

    const soundRef = useRef(sound);
    const onPlay: MouseEventHandler<SVGElement> = (e) => {
        e.stopPropagation();
        sound.play()
        setIsPlaying(true);
        setStartTime(new Date());
    }

    const onPause: MouseEventHandler<SVGElement> = (e) => {
        e.stopPropagation();
        sound.pause();
        setIsPlaying(false)
        setPauseSeek(seek);
    }

    const convertToTime = (value: number) => Math.floor(value / 60).toString().padStart(2, '0')
        + ':'
        + Math.floor(value % 60).toString().padStart(2, '0')
    const width = 100 * seek / duration + '%'

    useEffect(() => {
        const timer = setInterval(() => {
            if (isPlaying) {
                setSeek(pauseSeek + (Date.now() - startTime.getTime()) / 1000);
            }

        }, 10)
        return () => clearInterval(timer)
    }, [duration, isPlaying, pauseSeek, startTime])

    return (
        <>
            {
                isPlaying &&
                <IoPause onClick={onPause} className='w-12 h-6 text-gray-600 cursor-pointer' />
            }
            {
                !isPlaying &&
                <IoPlay onClick={onPlay} className='w-12 h-6 text-gray-600 cursor-pointer' />
            }
            <span className='opacity-80'>
                {convertToTime(seek)}
            </span>
            <div className='relative bg-gray-400 w-full h-1 rounded'>
                <div className='absolute top-0 left-0 h-1 bg-gray-800 rounded-md' style={{ width }} />
            </div>
            <span className='opacity-80'>
                {convertToTime(duration)}
            </span>
        </>
    );
}

export default AudioPlayer;
