import { TextField } from '@mui/material';

interface EditableTableCellProps {
    isEditing: boolean;
    editValue: string;
    value: string;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditableTableCell = ({
    isEditing,
    editValue,
    value,
    name,
    onChange,
}: EditableTableCellProps) => {
    return (
        <>
            {isEditing ? (
                <TextField
                    size="small"
                    name={name}
                    value={editValue}
                    onChange={onChange}
                />
            ) : (
                value
            )}
        </>
    );
};

export default EditableTableCell;
