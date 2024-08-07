import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { SnackbarProvider } from 'notistack';

import App from './App';

import { theme } from './styled/theme';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <SnackbarProvider>
                <ThemeProvider theme={theme}>
                    <App />
                </ThemeProvider>
            </SnackbarProvider>
        </BrowserRouter>
    </React.StrictMode>
);
