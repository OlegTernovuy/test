import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

import {
    AudioRecordsTableWrapper,
    CircularProgressWrapper,
} from '../../styled/ProjectsPage.styled';

import { IAudioRecord } from '../../types';

interface IAudioRecordProps {
    audioRecords: IAudioRecord[];
    loading: boolean;
}

const AudioRecordsTable = ({ audioRecords, loading }: IAudioRecordProps) => {
    const getDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const formattedDate = date.toLocaleDateString('en-US');
        return formattedDate;
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
