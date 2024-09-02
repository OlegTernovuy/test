import React, { useState } from 'react';

import { GridRenderEditCellParams } from '@mui/x-data-grid';
import { StyledTextarea } from '../../../styled/AudioRecordsTable.styled';

const CustomEditTextarea = (props: GridRenderEditCellParams) => {
    const { id, field, value, api } = props;
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    };

    const handleBlur = () => {
        api.setEditCellValue({ id, field, value: inputValue });
    };

    return (
        <StyledTextarea
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            multiline
            rows={4}
        />
    );
};

export default CustomEditTextarea;
