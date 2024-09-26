import React from 'react';
import { MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { CustomFormSelectStyled } from '../../styled/AddMediaRecordForm.styled';

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
        <CustomFormSelectStyled size="small" fullWidth>
            <Select value={selected} onChange={handleChange} fullWidth>
                {options.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </CustomFormSelectStyled>
    );
};

export default CustomSelect;
