import { Draggable } from '@hello-pangea/dnd';
import { GridRow, GridRowProps } from '@mui/x-data-grid';

interface CustomRowWrapperProps extends GridRowProps {
    row: any;
    index: number;
}

const CustomRowWrapper = (props: CustomRowWrapperProps) => {
    const { row, index, ...rest } = props;

    return (
        <Draggable key={row.id} draggableId={row.id} index={index}>
            {(provided, snapshot) => (
                <GridRow
                    index={index}
                    row={row}
                    {...rest}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                        visibility: snapshot.isDragging ? 'hidden' : 'visible',
                    }}
                />
            )}
        </Draggable>
    );
};

export default CustomRowWrapper;
