import { Draggable } from '@hello-pangea/dnd';
import { GridRow } from '@mui/x-data-grid';

const CustomRowWrapper = (props: any) => {
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
