import { ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';

export const MixedThemeProvider = ({
    theme,
    children,
}: {
    theme: Theme;
    children: ReactNode;
}) => (
    <MuiThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </MuiThemeProvider>
);
