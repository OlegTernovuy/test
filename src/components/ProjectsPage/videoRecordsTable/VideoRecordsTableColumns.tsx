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
import {
    FormattedCommentStyled,
    FormattedDateStyled,
} from '../../../styled/AudioRecordsTable.styled';

import {
    CustomIconButtonProps,
    IProjects,
    MoveVideoRecordParams,
} from '../../../types';
import { getDate } from '../../../utils/getDate';

const createVideoColumns = (
    isAdmin: boolean,
    startEditing: (id: string) => void,
    stopEditing: (id: string) => void,
    cancelEditing: (id: string) => void,
    handleDeleteVideoRecord: (
        videoRecordId: string,
        videoFileUrl: string
    ) => void,
    handleMoveVideoRecord: (params: MoveVideoRecordParams) => void,
    status: StatusMessages,
    mediaBlobUrl: string | undefined,
    actionButtons: CustomIconButtonProps[],
    startRecording: () => void,
    stopRecording: () => void,
    setVideoRef: (node: HTMLVideoElement | null) => void,
    projects: IProjects[],
    projectId: string
): GridColDef[] => [
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
            <video
                src={params.row.videoFileUrl}
                width={320}
                height={160}
                controls
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
            return date ? (
                <FormattedDateStyled>{getDate(date)}</FormattedDateStyled>
            ) : (
                ''
            );
        },
        sortComparator: (v1, v2) => {
            const date1 = (v1 as { _seconds: number })?._seconds;
            const date2 = (v2 as { _seconds: number })?._seconds;

            if (date1 && date2) {
                return date1 - date2;
            }
            return date1 ? -1 : 1;
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
                          projects={projects}
                          projectId={projectId}
                          startEditing={() => startEditing(params.row.id)}
                          handleDeleteRecord={() =>
                              handleDeleteVideoRecord(
                                  params.row.id,
                                  params.row.videoFileUrl
                              )
                          }
                          handleMoveMediaRecord={handleMoveVideoRecord}
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

export default createVideoColumns;
