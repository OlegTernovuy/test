import { DataGrid } from '@mui/x-data-grid';

import { VideoRecordsTableWrapper } from '../../../styled/VideoRecordsTable.styled';

interface IVideoRecordProps {}

const VideoRecordsTable = ({}: IVideoRecordProps) => {
    return (
        <VideoRecordsTableWrapper>
            <DataGrid
                columns={[
                    { field: 'Video name', flex: 1 },
                    { field: 'Comment', flex: 1 },
                    { field: 'Video', flex: 1 },
                    { field: 'Date', flex: 1 },
                    { field: 'Actions', flex: 1 },
                ]}
            />
        </VideoRecordsTableWrapper>
    );
};

export default VideoRecordsTable;
