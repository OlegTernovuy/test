import React, { createContext, useContext } from 'react';

import useAudioDevices from '../hook/useAudioDevices';

type AudioSettingsContextType = ReturnType<typeof useAudioDevices>;

const AudioSettingsContext = createContext<
    AudioSettingsContextType | undefined
>(undefined);

export const AudioSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const audioDevices = useAudioDevices();

    return (
        <AudioSettingsContext.Provider value={audioDevices}>
            {children}
        </AudioSettingsContext.Provider>
    );
};

export const useAudioSettings = (): AudioSettingsContextType => {
    const context = useContext(AudioSettingsContext);
    if (!context) {
        throw new Error(
            'useAudioSettings must be used within an AudioSettingsProvider'
        );
    }
    return context;
};
