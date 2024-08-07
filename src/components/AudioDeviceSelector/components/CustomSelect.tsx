import React from 'react';

import { FormControl, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
    TitleSelectStyled
} from "../../../styled/CustomSelect.styled";

interface OptionBase {
    value?: string;
    label: string;
}

interface ICustomSelectProps<T extends OptionBase> {
    title: string;
    selected: string;
    options: T[];
    onHandleChange: (id: string) => void;
}

const CustomSelect = <T extends OptionBase>({ title, selected, options, onHandleChange }: ICustomSelectProps<T>) => {
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
