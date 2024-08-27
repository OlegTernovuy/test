import React from 'react';

import { FormControl, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ICustomSelectProps } from '../../types';

const CustomSelect: React.FC<ICustomSelectProps> = ({
    selected,
    options,
    onHandleChange,
}) => {
    const handleChange = (event: SelectChangeEvent) => {
        const id = event.target.value;
        onHandleChange(id);
    };

    return (
        <FormControl size="small" sx={{ maxWidth: '200px' }}>
            <Select value={selected} onChange={handleChange}>
                {options.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CustomSelect;
