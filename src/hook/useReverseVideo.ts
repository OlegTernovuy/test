import { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

const useReverseVideo = (inputVideoUrl: string) => {
    const [isFFmpegReady, setIsFFmpegReady] = useState(false);
    const ffmpegInstance = useRef(new FFmpeg());

    const initializeFFmpeg = async () => {
        try {
            const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
            const ffmpeg = ffmpegInstance.current;
            ffmpeg.on('log', ({ message }) => {
                console.log(message);
            });

            await ffmpeg.load({
                coreURL: await toBlobURL(
                    `${baseURL}/ffmpeg-core.js`,
                    'text/javascript'
                ),
                wasmURL: await toBlobURL(
                    `${baseURL}/ffmpeg-core.wasm`,
                    'application/wasm'
                ),
                workerURL: await toBlobURL(
                    `${baseURL}/ffmpeg-core.worker.js`,
                    'text/javascript'
                ),
            });
            setIsFFmpegReady(true);
        } catch (error) {
            console.error('Error initializing FFmpeg:', error);
        }
    };

    const createReversedVideo = async () => {
        const ffmpeg = ffmpegInstance.current;

        try {
            // Write input file
            await ffmpeg.writeFile('input.mp4', await fetchFile(inputVideoUrl));

            // Create forward video (re-encode video, ignore audio)
            await ffmpeg.exec([
                '-i',
                'input.mp4',
                '-c:v',
                'libx264',
                '-preset',
                'ultrafast',
                '-an',
                'forward.mp4',
            ]);

            // Create backward video
            await ffmpeg.exec([
                '-i',
                'input.mp4',
                '-vf',
                'reverse',
                '-an',
                'backward.mp4',
            ]);

            // Create the file list for concatenation
            await ffmpeg.writeFile(
                'concat_list.txt',
                "file 'forward.mp4'\nfile 'backward.mp4'"
            );

            // Concatenate forward and backward videos
            await ffmpeg.exec([
                '-f',
                'concat',
                '-safe',
                '0',
                '-i',
                'concat_list.txt',
                '-c:v',
                'libx264',
                '-preset',
                'ultrafast',
                '-y',
                'final_output.mp4',
            ]);

            return ffmpeg.readFile('final_output.mp4');
        } catch (error) {
            console.error('Error processing video:', error);
        }
    };

    return { createReversedVideo, initializeFFmpeg, isFFmpegReady };
};

export default useReverseVideo;
