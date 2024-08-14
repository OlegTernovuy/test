import { useState, useEffect } from 'react';

import { GridAudioList, GridSidebar } from '../styled/ProjectsPage.styled';
import { AudioRecordsTable, Sidebar } from '../components';
import { Grid } from '@mui/material';

import useFetchData from '../hook/useFetch';
import { IAudioRecord } from '../types';

const ProjectsPage = () => {
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');

    const {
        data: audioRecords,
        loading,
        fetchData,
    } = useFetchData<IAudioRecord[]>(`/audio/${selectedProjectId}`);

    useEffect(() => {
        if (selectedProjectId) {
            fetchData();
        }
    }, [selectedProjectId, fetchData]);

    return (
        <Grid container>
            <GridSidebar item xs={2}>
                <Sidebar setSelectedProjectId={setSelectedProjectId} />
            </GridSidebar>
            <GridAudioList item xs={10}>
                <AudioRecordsTable
                    audioRecords={audioRecords}
                    loading={loading}
                />
            </GridAudioList>
        </Grid>
    );
};

export default ProjectsPage;
