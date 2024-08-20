import { useState, useEffect, useCallback } from 'react';

import {
    CircularProgressWrapper,
    GridAudioList,
    GridSidebar,
} from '../styled/ProjectsPage.styled';
import { CircularProgress, Grid } from '@mui/material';
import { AudioRecordsTable, ProjectDialog, Sidebar } from '../components';

import useFetchData from '../hook/useFetch';
import { IAudioRecord, IProjects } from '../types';

const ProjectsPage = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<'add' | 'edit' | 'delete'>(
        'add'
    );
    const [selectedProjectName, setSelectedProjectName] = useState<IProjects>({
        id: '',
        name: '',
    });
    const [selectedProjectId, setSelectedProjectId] = useState('');

    const { data: projects, fetchData: fetchProjects } =
        useFetchData<IProjects[]>(`/projects`);

    const handleFetchProjects = useCallback(async () => {
        await fetchProjects();
    }, [fetchProjects]);

    const {
        data: audioRecords,
        loading,
        fetchData,
    } = useFetchData<IAudioRecord[]>(`/audio/${selectedProjectId}`);

    const { loading: LoadingAddProject, fetchData: handleAddProject } =
        useFetchData('/projects', {
            method: 'POST',
        });

    const { loading: LoadingEditProject, fetchData: handleEditProject } =
        useFetchData(`/projects/${selectedProjectName.id}`, {
            method: 'PATCH',
        });

    const { loading: LoadingDeleteProject, fetchData: handleDeleteProject } =
        useFetchData(`/projects/${selectedProjectName.id}`, {
            method: 'DELETE',
        });

    useEffect(() => {
        handleFetchProjects();
    }, [handleFetchProjects]);

    useEffect(() => {
        if (selectedProjectId) {
            fetchData();
        }
    }, [fetchData, selectedProjectId]);

    const handleConfirmAction = async (projectName: string) => {
        const actions: Record<string, () => Promise<void>> = {
            add: async () => {
                await handleAddProject({ name: projectName });
                setSelectedProjectName({ id: '', name: '' });
            },
            edit: async () => {
                if (selectedProjectId) {
                    await handleEditProject({ name: projectName });
                    setSelectedProjectName({ id: '', name: '' });
                }
            },
            delete: async () => {
                if (selectedProjectName.id) {
                    await handleDeleteProject();
                }
            },
        };

        if (actions[dialogAction]) {
            await actions[dialogAction]();
            await handleFetchProjects();
        }
    };

    const onClose = () => {
        setDialogOpen(false);
        setSelectedProjectName({ id: '', name: '' });
    };

    return (
        <Grid container>
            {(LoadingAddProject ||
                LoadingEditProject ||
                LoadingDeleteProject) && (
                <CircularProgressWrapper>
                    <CircularProgress />
                </CircularProgressWrapper>
            )}
            <GridSidebar item xs={2}>
                <Sidebar
                    projects={projects}
                    setDialogOpen={setDialogOpen}
                    setDialogAction={setDialogAction}
                    setSelectedProjectName={setSelectedProjectName}
                    setSelectedProjectId={setSelectedProjectId}
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
                projectName={selectedProjectName.name}
            />
        </Grid>
    );
};

export default ProjectsPage;
