import {
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import {
    AudioRecordsTableWrapper,
    CircularProgressWrapper,
} from '../../styled/ProjectsPage.styled';

import { IAudioRecord } from '../../types';
import { useAuth } from '../../Providers/AuthProvider';
import {
    deleteAudioFile,
    deleteAudioRecord,
} from '../../services/Media.service';
import { useState } from 'react';

interface IAudioRecordProps {
    audioRecords: IAudioRecord[];
    loading: boolean;
    onOpenAudioRecordDialog: () => void;
    setAudioDialogAction: React.Dispatch<
        React.SetStateAction<'add' | 'edit' | 'delete'>
    >;
    onSelect: (record: IAudioRecord) => void;
    fetchData: () => void;
}

const AudioRecordsTable = ({
    audioRecords,
    loading,
    onOpenAudioRecordDialog,
    setAudioDialogAction,
    onSelect,
    fetchData,
}: IAudioRecordProps) => {
    const { isAdmin } = useAuth();

    const getDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const formattedDate = date.toLocaleDateString('en-US');
        return formattedDate;
    };

    const handleDeleteAudioRecord = async (
        audioRecordId: string,
        audioFileUrl: string
    ) => {
        try {
            await deleteAudioRecord(audioRecordId);
            await deleteAudioFile(audioFileUrl);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const [editingRecord, setEditingRecord] = useState<IAudioRecord | null>(
        null
    );
    const [editedData, setEditedData] = useState<IAudioRecord | null>(null);

    const startEditing = (record: IAudioRecord) => {
        setEditingRecord(record);
        setEditedData(record);
    };

    const handleSave = async () => {
        if (editedData) {
            try {
                // await updateAudioRecord(editedData);
                setEditingRecord(null);
                fetchData();
            } catch (error) {
                console.error('Error updating record:', error);
            }
        }
    };

    const handleCancel = () => {
        setEditingRecord(null);
        setEditedData(null);
    };

    return (
        <AudioRecordsTableWrapper>
            {loading && (
                <CircularProgressWrapper>
                    <CircularProgress />
                </CircularProgressWrapper>
            )}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Audio name</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Project</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>Audio</TableCell>
                            <TableCell>Date</TableCell>
                            {isAdmin && (
                                <>
                                    <TableCell>Edit</TableCell>
                                    <TableCell>Delete</TableCell>
                                </>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {audioRecords &&
                            (audioRecords.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        No Records
                                    </TableCell>
                                </TableRow>
                            ) : (
                                audioRecords.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>
                                            {editingRecord?.id === record.id ? (
                                                <TextField
                                                    size="small"
                                                    value={
                                                        editedData?.name || ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditedData(
                                                            (prev) => ({
                                                                ...prev!,
                                                                name: e.target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            ) : (
                                                record.name
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editingRecord?.id === record.id ? (
                                                <TextField
                                                    size="small"
                                                    value={
                                                        editedData?.author || ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditedData(
                                                            (prev) => ({
                                                                ...prev!,
                                                                author: e.target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            ) : (
                                                record.author
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editingRecord?.id === record.id ? (
                                                <TextField
                                                    size="small"
                                                    value={
                                                        editedData?.project ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditedData(
                                                            (prev) => ({
                                                                ...prev!,
                                                                project:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            ) : (
                                                record.project
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editingRecord?.id === record.id ? (
                                                <TextField
                                                    size="small"
                                                    value={
                                                        editedData?.comment ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditedData(
                                                            (prev) => ({
                                                                ...prev!,
                                                                comment:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            ) : (
                                                record.comment
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editingRecord?.id === record.id ? (
                                                <input
                                                    type="file"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0];
                                                        if (file) {
                                                            setEditedData(
                                                                (prev) => ({
                                                                    ...prev!,
                                                                    audioFileUrl:
                                                                        URL.createObjectURL(
                                                                            file
                                                                        ),
                                                                })
                                                            );
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <audio
                                                    src={record.audioFileUrl}
                                                    controls
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getDate(
                                                record.date._seconds
                                            ).toString()}
                                        </TableCell>
                                        {isAdmin && (
                                            <>
                                                <TableCell>
                                                    {editingRecord?.id ===
                                                    record.id ? (
                                                        <>
                                                            <IconButton
                                                                onClick={
                                                                    handleSave
                                                                }
                                                            >
                                                                <SaveIcon
                                                                    fontSize="small"
                                                                    color="primary"
                                                                />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={
                                                                    handleCancel
                                                                }
                                                            >
                                                                <CancelIcon
                                                                    fontSize="small"
                                                                    color="secondary"
                                                                />
                                                            </IconButton>
                                                        </>
                                                    ) : (
                                                        <IconButton
                                                            onClick={() =>
                                                                startEditing(
                                                                    record
                                                                )
                                                            }
                                                        >
                                                            <EditIcon
                                                                fontSize="small"
                                                                color="primary"
                                                            />
                                                        </IconButton>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => {
                                                            handleDeleteAudioRecord(
                                                                record.id,
                                                                record.audioFileUrl
                                                            );
                                                        }}
                                                    >
                                                        <DeleteIcon
                                                            fontSize="small"
                                                            color="primary"
                                                        />
                                                    </IconButton>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Audio name</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Project</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>Audio</TableCell>
                            <TableCell>Date</TableCell>
                            {isAdmin && (
                                <>
                                    <TableCell>Edit</TableCell>
                                    <TableCell>Delete</TableCell>
                                </>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {audioRecords &&
                            (audioRecords.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        No Records
                                    </TableCell>
                                </TableRow>
                            ) : (
                                audioRecords.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>{record.name}</TableCell>
                                        <TableCell>{record.author}</TableCell>
                                        <TableCell>{record.project}</TableCell>
                                        <TableCell>{record.comment}</TableCell>
                                        <TableCell>
                                            {
                                                <audio
                                                    src={record.audioFileUrl}
                                                    controls
                                                />
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {getDate(
                                                record.date._seconds
                                            ).toString()}
                                        </TableCell>
                                        {isAdmin && (
                                            <>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => {
                                                            onOpenAudioRecordDialog();
                                                            setAudioDialogAction(
                                                                'edit'
                                                            );
                                                            onSelect(record);
                                                        }}
                                                    >
                                                        <EditIcon
                                                            fontSize="small"
                                                            color="primary"
                                                        />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => {
                                                            handleDeleteAudioRecord(
                                                                record.id,
                                                                record.audioFileUrl
                                                            );
                                                        }}
                                                    >
                                                        <DeleteIcon
                                                            fontSize="small"
                                                            color="primary"
                                                        />
                                                    </IconButton>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))
                            ))}
                    </TableBody>
                </Table>
            </TableContainer> */}
        </AudioRecordsTableWrapper>
    );
};

export default AudioRecordsTable;
