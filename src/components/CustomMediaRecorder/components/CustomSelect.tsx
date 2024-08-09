import React from 'react';

import { FormControl, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { TitleSelectStyled } from "../../../styled/CustomMediaRecorder.styled";
import { OptionBase, ICustomSelectProps } from "../../../types";


const CustomSelect:React.FC<ICustomSelectProps> =({ title, selected, options, onHandleChange }) => {
    const handleChange = (event: SelectChangeEvent) => {
        const id = event.target.value;
        onHandleChange(id);
    }

    return (
        <div>
            <TitleSelectStyled>{title}</TitleSelectStyled>
            <FormControl fullWidth>
                <Select
                    value={selected}
                    onChange={handleChange}
                >
                    {options.map((option, index) => (
                        <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
)
};

export default CustomSelect;
