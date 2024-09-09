import React from 'react';

import { MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ICustomSelectProps } from '../../types';
import { CustomFormSelectStyled } from '../../styled/AddMediaRecordForm.styled';

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
        <CustomFormSelectStyled size="small">
            <Select value={selected} onChange={handleChange}>
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
