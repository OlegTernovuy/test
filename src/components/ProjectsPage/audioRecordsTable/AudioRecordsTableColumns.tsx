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
    EditMediaPopover,
    AudioPlayerComponent,
    CustomMediaRecorder,
} from '../../index';
import {
    FormattedCommentStyled,
    FormattedDateStyled,
} from '../../../styled/AudioRecordsTable.styled';

import {
    CustomIconButtonProps,
    IProjects,
    MoveAudioRecordParams,
} from '../../../types';
import { getDate } from '../../../utils/getDate';

const createAudioColumns = (
    isAdmin: boolean,
    startEditing: (id: string) => void,
    stopEditing: (id: string) => void,
    cancelEditing: (id: string) => void,
    handleDeleteAudioRecord: (
        audioRecordId: string,
        audioFileUrl: string
    ) => void,
    handleMoveAudioRecord: (params: MoveAudioRecordParams) => void,
    status: StatusMessages,
    mediaBlobUrl: string | undefined,
    actionButtons: CustomIconButtonProps[],
    startRecording: () => void,
    stopRecording: () => void,
    selectedOutput: string,
    projects: IProjects[],
    projectId: string,
    selectedAudioId: string | null,
    handleSelectAudio: (id: string) => void,

): GridColDef[] => [
    {
        field: 'name',
        headerName: 'Audio name',
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
        field: 'audio',
        headerName: 'Audio',
        headerAlign: 'center',
        align: 'center',
        flex: 1.5,
        editable: true,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
            <AudioPlayerComponent
                audioUrl={params.row.audioFileUrl}
                selectedOutput={selectedOutput}
                audioId={params.row.id}
                isSelected={selectedAudioId === params.row.id}
                onSelect={() => handleSelectAudio(params.row.id)}
            />
        ),
        renderEditCell: (_: GridRenderEditCellParams) => (
            <CustomMediaRecorder
                status={status}
                mediaBlobUrl={mediaBlobUrl}
                actionButtons={actionButtons}
                startRecording={startRecording}
                stopRecording={stopRecording}
                wavesurferId="wavesurfer-edit"
            />
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
                  sortable: false,
                  flex: 0.5,
                  renderCell: (params: GridRenderCellParams) => (
                      <EditMediaPopover
                          record={params.row}
                          projects={projects}
                          projectId={projectId}
                          startEditing={() => startEditing(params.row.id)}
                          handleDeleteRecord={() =>
                              handleDeleteAudioRecord(
                                  params.row.id,
                                  params.row.audioFileUrl
                              )
                          }
                          handleMoveMediaRecord={handleMoveAudioRecord}
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

export default createAudioColumns;
