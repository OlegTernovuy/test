import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

export const theme = createTheme({
    palette: {
        background: {
            default: '#FFFFFFB2',
            paper: '#f5f9ff',
        },
        text: {
            primary: '#1c1c1c',
        },
        primary: {
            main: '#1976D2',
        },
        secondary: {
            main: '#526e75',
        },
        grey: {
            100: '#0000000a',
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 480,
            md: 768,
            lg: 1024,
            xl: 1200,
        },
    },
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '&.MuiDataGrid-root': {
                        border: 'none',
                    },
                    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                        paddingTop: '15px',
                        paddingBottom: '15px',
                        backgroundColor: '#fff',
                    },
                    '&.MuiDataGrid-root .MuiDataGrid-virtualScroller': {
                        overflowX: 'hidden',
                    }
                },
            },
        },
    },
});
