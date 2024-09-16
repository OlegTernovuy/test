import { useMemo, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import {
    DataGrid,
    GridColDef,
    GridPaginationModel,
    GridSortModel,
} from '@mui/x-data-grid';

import { ProjectTitleSearchComponent, CustomRowWrapper } from '../index';
import { VideoRecordsTableWrapper } from '../../styled/VideoRecordsTable.styled';

import { useAuth } from '../../Providers/AuthProvider';
import { IAudioRecord, IVideoRecord } from '../../types';

interface IMediaTableProps {
    onDragEnd: ({ destination, source }: DropResult) => Promise<void>;
    apiRef: React.MutableRefObject<GridApiCommunity>;
    mediaRecords: IAudioRecord[] | IVideoRecord[];
    columns: GridColDef[];
    projectName: string;
    isLoading: boolean;
}

const MediaTable = ({
    onDragEnd,
    apiRef,
    mediaRecords,
    columns,
    projectName,
    isLoading,
}: IMediaTableProps) => {
    const { isAdmin } = useAuth();

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
        {
            pageSize: 30,
            page: 0,
        }
    );
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const isAnyColumnSorted = useMemo(() => sortModel.length > 0, [sortModel]);

    const handleSortModelChange = (newSortModel: GridSortModel) => {
        setSortModel(newSortModel);
    };
    return (
        <VideoRecordsTableWrapper>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-table-list">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <DataGrid
                                apiRef={apiRef}
                                rows={mediaRecords}
                                columns={columns}
                                autoHeight
                                getRowId={(row) => row.id}
                                sortModel={sortModel}
                                onSortModelChange={handleSortModelChange}
                                loading={isLoading}
                                editMode="row"
                                getRowHeight={() => 'auto'}
                                getEstimatedRowHeight={() => 200}
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                pageSizeOptions={[30, 75, 100]}
                                disableRowSelectionOnClick
                                onCellDoubleClick={(_, event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                }}
                                slots={{
                                    toolbar: () => (
                                        <ProjectTitleSearchComponent
                                            projectName={projectName}
                                        />
                                    ),
                                    row:
                                        isAdmin && !isAnyColumnSorted
                                            ? CustomRowWrapper
                                            : undefined,
                                }}
                            />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </VideoRecordsTableWrapper>
    );
};

export default MediaTable;
