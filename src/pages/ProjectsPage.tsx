import { useState, useEffect } from 'react';

import { GridAudioList, GridSidebar } from '../styled/ProjectsPage.styled';
import { AudioRecordsTable, Sidebar } from '../components';
import { Grid } from '@mui/material';

import useFetchData from '../hook/useFetch';
import { IAudioRecord } from '../types';
import ProjectDialog from '../components/ProjectsPage/ProjectDialog';
import {
    handleAddProject,
    handleDeleteProject,
    handleEditProject,
} from '../services/Projects.service';

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

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<'add' | 'edit' | 'delete'>(
        'add'
    );
    const [selectedProject, setSelectedProject] = useState('');

    // const handleOpenDialog = (
    //     actionType: 'add' | 'edit' | 'delete',
    //     projectName: string = ''
    // ) => {
    //     setDialogAction(actionType);
    //     setSelectedProject(projectName);
    //     setDialogOpen(true);
    // };

    const handleConfirmAction = (projectName: string) => {
        if (dialogAction === 'add') {
            setSelectedProject('');
            handleAddProject(projectName);
        } else if (dialogAction === 'edit') {
            setSelectedProject('');
            handleEditProject(projectName, selectedProjectId);
        } else if (dialogAction === 'delete') {
            handleDeleteProject(selectedProjectId);
        }
    };

    const onClose = () => {
        setDialogOpen(false);
        setSelectedProject('');
    };

    return (
        <Grid container>
            <GridSidebar item xs={2}>
                <Sidebar
                    setSelectedProjectId={setSelectedProjectId}
                    setDialogOpen={setDialogOpen}
                    setDialogAction={setDialogAction}
                    setSelectedProject={setSelectedProject}
                />
            </GridSidebar>
            <GridAudioList item xs={10}>
                <AudioRecordsTable
                    audioRecords={audioRecords}
                    loading={loading}
                />
            </GridAudioList>
            <ProjectDialog
                open={dialogOpen}
                onClose={onClose}
                onConfirm={handleConfirmAction}
                actionType={dialogAction}
                projectName={selectedProject}
            />
        </Grid>
    );
};

export default ProjectsPage;
