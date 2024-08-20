import {
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import {
    AudioRecordsTableWrapper,
    CircularProgressWrapper,
} from '../../styled/ProjectsPage.styled';

import { IAudioRecord } from '../../types';
import { useAuth } from '../../Providers/AuthProvider';
import { deleteAudioRecord } from '../../services/Media.service';

interface IAudioRecordProps {
    audioRecords: IAudioRecord[];
    loading: boolean;
    onOpenAudioRecordDialog: () => void;
    setAudioDialogAction: React.Dispatch<
        React.SetStateAction<'add' | 'edit' | 'delete'>
    >;
    onSelect: (record: IAudioRecord) => void;
}

const AudioRecordsTable = ({
    audioRecords,
    loading,
    onOpenAudioRecordDialog,
    setAudioDialogAction,
    onSelect,
}: IAudioRecordProps) => {
    const { isAdmin } = useAuth();

    const getDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const formattedDate = date.toLocaleDateString('en-US');
        return formattedDate;
    };

    const handleDeleteAudioRecord = async (audioRecordId: string) => {
        await deleteAudioRecord(audioRecordId);
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
                                                            // onOpenAudioRecordDialog();
                                                            // setAudioDialogAction(
                                                            //     'delete'
                                                            // );
                                                            handleDeleteAudioRecord(
                                                                record.id
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
        </AudioRecordsTableWrapper>
    );
};

export default AudioRecordsTable;
