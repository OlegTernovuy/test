import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-data-grid-premium/themeAugmentation';

const muiTheme = createTheme({
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
                },
            },
        },
    },
    mixins: {
        MuiDataGrid: {
            containerBackground: '#526e75',
        },
    },
});

export default muiTheme;
