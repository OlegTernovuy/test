import { StyledTextarea } from "../../../styled/AudioRecordsTable.styled";

interface EditableCommentCellProps {
    isEditing: boolean;
    editValue: string;
    value: string;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditableCommentCell = ({
    isEditing,
    editValue,
    value,
    name,
    onChange,
}: EditableCommentCellProps) => {
    return (
        <>
            {isEditing ? (
                <StyledTextarea
                    multiline
                    rows={4}
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

export default EditableCommentCell;
