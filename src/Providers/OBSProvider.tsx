import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import OBSWebSocket from 'obs-websocket-js';

interface OBSContextType {
    obs: OBSWebSocket;
    connected: boolean;
}

const OBSContext = createContext<OBSContextType | null>(null);

interface OBSProviderProps {
    children: ReactNode;
}

export const OBSProvider = ({ children }: OBSProviderProps) => {
    const [obs] = useState(() => new OBSWebSocket());
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const connectOBS = async () => {
            try {
                const { obsWebSocketVersion } = await obs.connect(
                    'ws://localhost:4455'
                );
                console.log(
                    `Connected to OBS WebSocket server: ${obsWebSocketVersion}`
                );
                await obs.call('StartVirtualCam');
                setConnected(true);
            } catch (error) {
                console.error(
                    'Failed to connect to OBS WebSocket server:',
                    error
                );
            }
        };

        connectOBS();

        obs.on('ConnectionOpened', () => setConnected(true));
        obs.on('ConnectionClosed', () => setConnected(false));

        return () => {
            if (obs.identified) {
                obs.disconnect();
            }

            obs.removeAllListeners('ConnectionOpened');
            obs.removeAllListeners('ConnectionClosed');
        };
    }, [obs]);

    return (
        <OBSContext.Provider value={{ obs, connected }}>
            {children}
        </OBSContext.Provider>
    );
};

export const useOBS = (): OBSContextType => {
    const context = useContext(OBSContext);
    if (context === null) {
        throw new Error('useOBS must be used within an OBSProvider');
    }
    return context;
};
