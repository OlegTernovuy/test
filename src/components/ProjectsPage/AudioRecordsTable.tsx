import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

import { IAudioRecord } from '../../types';

interface IAudioRecordProps {
    audioRecords: IAudioRecord[];
    loadings: boolean;
}

const AudioRecordsTable = ({ audioRecords, loadings }: IAudioRecordProps) => {
    const getDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const formattedDate = date.toLocaleDateString('en-US');
        return formattedDate;
    };

    return (
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
                    {loadings ? (
                        <CircularProgress />
                    ) : audioRecords.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4}>No Records</TableCell>
                        </TableRow>
                    ) : (
                        audioRecords.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell>{record.name}</TableCell>
                                <TableCell>{record.author}</TableCell>
                                <TableCell>{record.project}</TableCell>
                                <TableCell>
                                    {getDate(record.date._seconds).toString()}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AudioRecordsTable;
