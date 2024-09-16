import React, { useState } from 'react';

import { GridRenderEditCellParams } from '@mui/x-data-grid';
import { StyledTextarea } from '../../../styled/AddMediaRecordForm.styled';

const CustomEditTextarea = (props: GridRenderEditCellParams) => {
    const { id, field, value, api } = props;
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
        api.setEditCellValue({ id, field, value: event.target.value });
    };

    return (
        <StyledTextarea value={inputValue} onChange={handleChange} rows={4} />
    );
};

export default CustomEditTextarea;
