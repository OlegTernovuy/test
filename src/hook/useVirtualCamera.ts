import { useOBS } from '../Providers/OBSProvider';

type SetVideoSourceOptions = { url: string; loop: boolean };

interface UseVirtualCameraOptions {
    sceneName: string;
    inputName: string;
}

const useVirtualCamera = ({
    sceneName,
    inputName,
}: UseVirtualCameraOptions) => {
    const { obs, connected } = useOBS();

    const ensureSceneExists = async () => {
        const { scenes } = await obs.call('GetSceneList');

        if (!scenes.some((scene) => scene.sceneName === sceneName)) {
            await obs.call('CreateScene', { sceneName });
        }

        await obs.call('SetCurrentProgramScene', { sceneName });
    };

    const createVideoInput = async (url: string, loop: boolean) => {
        const inputSettings = {
            local_file: url,
            is_local_file: true,
            looping: loop,
            show_nothing_when_playback_ends: true,
        };

        const { inputs } = await obs.call('GetInputList');
        const inputExists = inputs.some(
            (input) => input.inputName === inputName
        );

        if (inputExists) {
            await obs.call('SetInputSettings', { inputName, inputSettings });
        } else {
            await obs.call('CreateInput', {
                sceneName,
                inputName,
                inputKind: 'ffmpeg_source',
                inputSettings,
            });
        }

        const { sceneItems } = await obs.call('GetSceneItemList', {
            sceneName,
        });
        const source = sceneItems.find((item) => item.sourceName === inputName);

        if (source) {
            await obs.call('SetSceneItemTransform', {
                sceneName,
                sceneItemId: Number(source.sceneItemId),
                sceneItemTransform: {
                    boundsType: 'OBS_BOUNDS_SCALE_INNER',
                    boundsAlignment: 4,
                    boundsWidth: 1920,
                    boundsHeight: 1080,
                },
            });
        }
    };

    const createWebcamInput = async () => {
        const isMac = navigator.userAgent.toLowerCase().includes('mac');

        const { propertyItems } = await obs.call(
            'GetInputPropertiesListPropertyItems',
            {
                inputName,
                propertyName: 'device',
            }
        );

        const webcamDevices = propertyItems.filter(
            (item) =>
                typeof item?.itemName === 'string' &&
                item.itemName.toLowerCase().includes('webcam')
        );

        const inputSettings = {
            device: webcamDevices[0].value,
        };

        const { inputs } = await obs.call('GetInputList');
        const inputExists = inputs.some(
            (input) => input.inputName === inputName
        );

        if (inputExists) {
            await obs.call('SetInputSettings', { inputName, inputSettings });
        } else {
            await obs.call('CreateInput', {
                sceneName,
                inputName,
                inputKind: isMac ? 'av_capture_input_v2' : 'dshow_input',
                inputSettings,
            });
        }

        const { sceneItems } = await obs.call('GetSceneItemList', {
            sceneName,
        });
        const source = sceneItems.find((item) => item.sourceName === inputName);

        if (source) {
            await obs.call('SetSceneItemTransform', {
                sceneName,
                sceneItemId: Number(source.sceneItemId),
                sceneItemTransform: {
                    boundsType: 'OBS_BOUNDS_SCALE_INNER',
                    boundsAlignment: 4,
                    boundsWidth: 1920,
                    boundsHeight: 1080,
                },
            });
        }
    };

    const triggerMediaInputAction = async (mediaAction: string) => {
        if (!connected) {
            return;
        }

        try {
            await obs.call('TriggerMediaInputAction', {
                inputName,
                mediaAction,
            });
        } catch (error) {
            console.error(
                `Error triggering media action ${mediaAction}:`,
                error
            );
        }
    };

    const setVideoSource = async ({ url, loop }: SetVideoSourceOptions) => {
        if (!connected) {
            return;
        }

        try {
            await ensureSceneExists();
            await createVideoInput(url, loop);
            await triggerMediaInputAction(
                'OBS_WEBSOCKET_MEDIA_INPUT_ACTION_RESTART'
            );
        } catch (error) {
            console.error('Error setting video source:', error);
        }
    };
    const setWebcamSource = async () => {
        if (!connected) {
            return;
        }

        try {
            await ensureSceneExists();
            await obs.call('SetCurrentProgramScene', { sceneName });
            await createWebcamInput();
        } catch (error) {
            console.error('Error setting webcam source:', error);
        }
    };

    const pauseVideo = () =>
        triggerMediaInputAction('OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PAUSE');

    const playVideo = () =>
        triggerMediaInputAction('OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PLAY');

    return { setVideoSource, setWebcamSource, pauseVideo, playVideo };
};

export default useVirtualCamera;
