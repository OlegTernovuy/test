import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { CssBaseline } from '@mui/material';

import App from './App';

import { theme } from './styled/theme';
import { GlobalStyle } from './styled/GlobalStyle.styled';
import {
    MediaSettingsProvider,
    AuthProvider,
    MixedThemeProvider,
    OBSProvider,
} from './Providers';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
        <AuthProvider>
            <MediaSettingsProvider>
                <OBSProvider>
                    <SnackbarProvider>
                        <MixedThemeProvider theme={theme}>
                            <CssBaseline />
                            <GlobalStyle />
                            <App />
                        </MixedThemeProvider>
                    </SnackbarProvider>
                </OBSProvider>
            </MediaSettingsProvider>
        </AuthProvider>
    </BrowserRouter>
);
