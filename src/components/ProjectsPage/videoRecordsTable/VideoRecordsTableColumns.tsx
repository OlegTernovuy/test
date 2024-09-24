import { StatusMessages } from 'react-media-recorder-2';
import {
    GridActionsCellItem,
    GridColDef,
    GridRenderCellParams,
    GridRenderEditCellParams,
} from '@mui/x-data-grid';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

import {
    CustomEditTextarea,
    EditAudioPopover,
    CustomVideoRecorder,
} from '../../';
import { FormattedCommentStyled } from '../../../styled/AudioRecordsTable.styled';
import { CustomIconButtonProps } from '../../../types';
import VideoPlayer from './VideoPlayer';

const getDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US');
};

const createVideoColumns = (
    isAdmin: boolean,
    projectId: string,
    startEditing: (id: string) => void,
    stopEditing: (id: string) => void,
    cancelEditing: (id: string) => void,
    handleDeleteVideoRecord: (
        videoRecordId: string,
        videoFileUrl: string
    ) => void,
    status: StatusMessages,
    mediaBlobUrl: string | undefined,
    actionButtons: CustomIconButtonProps[],
    startRecording: () => void,
    stopRecording: () => void,
    setVideoRef: (node: HTMLVideoElement | null) => void,
    fetchData: (projectId: string) => void
): GridColDef[] => {
    return [
        {
            field: 'name',
            headerName: 'Video name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            editable: true,
            renderCell: (params: GridRenderCellParams) => params.row.name,
        },
        {
            field: 'comment',
            headerName: 'Comment',
            flex: 2,
            headerAlign: 'center',
            editable: true,
            renderCell: (params: GridRenderCellParams) => (
                <FormattedCommentStyled>
                    {params.row.comment}
                </FormattedCommentStyled>
            ),
            renderEditCell: (params: GridRenderEditCellParams) => (
                <CustomEditTextarea {...params} />
            ),
        },
        {
            field: 'video',
            headerName: 'Video',
            headerAlign: 'center',
            align: 'center',
            flex: 1.5,
            editable: true,
            renderCell: (params: GridRenderCellParams) => (
                <VideoPlayer
                    videoFileUrl={params.row.videoFileUrl}
                    projectId={projectId}
                    videoRecordId={params.row.id}
                    onDataRefresh={fetchData}
                />
            ),
            renderEditCell: (_: GridRenderEditCellParams) => (
                <CustomVideoRecorder
                    status={status}
                    mediaBlobUrl={mediaBlobUrl}
                    actionButtons={actionButtons}
                    startRecording={startRecording}
                    stopRecording={stopRecording}
                >
                    {status === 'idle' || status === 'recording' ? (
                        <video
                            key="recording"
                            ref={setVideoRef}
                            width={320}
                            height={160}
                            autoPlay
                        />
                    ) : (
                        <video
                            key="recorded"
                            src={mediaBlobUrl}
                            width={320}
                            height={160}
                            controls
                        />
                    )}
                </CustomVideoRecorder>
            ),
        },
        {
            field: 'date',
            headerName: 'Date',
            headerAlign: 'center',
            align: 'center',
            flex: 0.5,
            renderCell: (params: GridRenderCellParams) => {
                const date = (params.value as { _seconds: number })?._seconds;
                return date ? getDate(date) : '';
            },
        },
        ...(isAdmin
            ? [
                  {
                      field: 'actions',
                      headerName: 'Actions',
                      editable: true,
                      flex: 0.5,
                      renderCell: (params: GridRenderCellParams) => (
                          <EditAudioPopover
                              record={params.row}
                              startEditing={() => startEditing(params.row.id)}
                              handleDeleteRecord={() =>
                                  handleDeleteVideoRecord(
                                      params.row.id,
                                      params.row.videoFileUrl
                                  )
                              }
                          />
                      ),
                      renderEditCell: (params: GridRenderCellParams) => (
                          <div>
                              <GridActionsCellItem
                                  icon={<CheckIcon />}
                                  label="Save"
                                  onClick={() => stopEditing(params.row.id)}
                              />
                              <GridActionsCellItem
                                  icon={<CloseIcon />}
                                  label="Cancel"
                                  onClick={() => cancelEditing(params.row.id)}
                              />
                          </div>
                      ),
                  },
              ]
            : []),
    ];
};

export default createVideoColumns;
