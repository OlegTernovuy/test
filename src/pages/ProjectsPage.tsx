import { useState } from 'react';

import { GridAudioList, GridSidebar } from '../styled/ProjectsPage.styled';
import { AudioRecordsTable, Sidebar } from '../components';
import { Grid } from '@mui/material';

import { IAudioRecord } from '../types';

const ProjectsPage = () => {
    const [audioRecords, setAudioRecords] = useState<IAudioRecord[]>([]);
    const [loadings, setLoadings] = useState(false);

    return (
        <Grid container>
            <GridSidebar item xs={2}>
                <Sidebar
                    setAudioRecords={setAudioRecords}
                    setLoadings={setLoadings}
                />
            </GridSidebar>
            <GridAudioList item xs={10}>
                <AudioRecordsTable audioRecords={audioRecords} loadings={loadings}/>
            </GridAudioList>
        </Grid>
    );
};

export default ProjectsPage;
