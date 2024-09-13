import React, { createContext, useContext } from 'react';

import { useAudioDevices, useVideoDevices } from '../hook';

type MediaSettingsContextType = {
    audioDevices: ReturnType<typeof useAudioDevices>;
    videoDevices: ReturnType<typeof useVideoDevices>;
};

const MediaSettingsContext = createContext<
    MediaSettingsContextType | undefined
>(undefined);

export const MediaSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const audioDevices = useAudioDevices();
    const videoDevices = useVideoDevices();

    return (
        <MediaSettingsContext.Provider
            value={{
                audioDevices,
                videoDevices,
            }}
        >
            {children}
        </MediaSettingsContext.Provider>
    );
};

export const useMediaSettings = (): MediaSettingsContextType => {
    const context = useContext(MediaSettingsContext);
    if (!context) {
        throw new Error(
            'useAudioSettings must be used within an MediaSettingsProvider'
        );
    }
    return context;
};
