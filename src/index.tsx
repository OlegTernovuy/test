import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { CssBaseline } from '@mui/material';

import App from './App';

import { theme } from './styled/theme';
import { GlobalStyle } from './styled/GlobalStyle.styled';
import {
    AudioSettingsProvider,
    AuthProvider,
    MixedThemeProvider,
} from './Providers';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    // <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <AudioSettingsProvider>
                    <SnackbarProvider>
                        <MixedThemeProvider theme={theme}>
                            <CssBaseline />
                            <GlobalStyle />
                            <App />
                        </MixedThemeProvider>
                    </SnackbarProvider>
                </AudioSettingsProvider>
            </AuthProvider>
        </BrowserRouter>
    // </React.StrictMode>
);
