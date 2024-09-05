import { StatusMessages } from 'react-media-recorder-2';

import {
    CustomEditTextarea,
    EditAudioPopover,
    AudioPlayerComponent,
    CustomMediaRecorder,
} from '../../index';
import {
    GridActionsCellItem,
    GridColDef,
    GridRenderCellParams,
    GridRenderEditCellParams,
} from '@mui/x-data-grid';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { FormattedCommentStyled } from '../../../styled/AudioRecordsTable.styled';

import { CustomIconButtonProps } from '../../../types';

const getDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US');
};

const createColumns = (
    isAdmin: boolean,
    startEditing: (id: string) => void,
    stopEditing: (id: string) => void,
    cancelEditing: (id: string) => void,
    handleDeleteAudioRecord: (
        audioRecordId: string,
        audioFileUrl: string
    ) => void,
    status: StatusMessages,
    mediaBlobUrl: string | undefined,
    actionButtons: CustomIconButtonProps[],
    startRecording: () => void,
    stopRecording: () => void,
    selectedOutput: string
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
        flex: 2,
        editable: true,
        renderCell: (params: GridRenderCellParams) => (
            <AudioPlayerComponent
                audioUrl={params.row.audioFileUrl}
                selectedOutput={selectedOutput}
            />
        ),
        renderEditCell: (params: GridRenderEditCellParams) => (
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
        flex: 1,
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
                          handleDeleteAudioRecord={() =>
                              handleDeleteAudioRecord(
                                  params.row.id,
                                  params.row.audioFileUrl
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

export default createColumns;
