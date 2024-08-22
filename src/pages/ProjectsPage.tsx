import { useState, useEffect, useCallback } from 'react';

import {
    CircularProgressWrapper,
    GridAudioList,
    GridSidebar,
} from '../styled/ProjectsPage.styled';
import {
    AudioRecordsTable,
    ProjectDialog,
    Sidebar,
    AddAudioRecordForm,
} from '../components';
import { CircularProgress, Grid } from '@mui/material';

import useFetchData from '../hook/useFetch';
import { IAudioRecord, IProjects } from '../types';
import { useAuth } from '../Providers/AuthProvider';

const ProjectsPage = () => {
    const { isAdmin, user } = useAuth();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<'add' | 'edit' | 'delete'>(
        'add'
    );
    const [selectedProjectForUpdate, setSelectedProjectForUpdate] =
        useState<IProjects>({
            id: '',
            name: '',
        });
    const [selectedProjectForCreate, setSelectedProjectForCreate] =
        useState<IProjects>({
            id: '',
            name: '',
        });

    const { data: projects, fetchData: fetchProjects } =
        useFetchData<IProjects[]>(`/projects`);

    const handleFetchProjects = useCallback(async () => {
        await fetchProjects();
    }, [fetchProjects]);

    const {
        data: audioRecords,
        loading,
        fetchData,
    } = useFetchData<IAudioRecord[]>(`/audio/${selectedProjectForCreate.id}`);

    const { loading: LoadingAddProject, fetchData: handleAddProject } =
        useFetchData('/projects', {
            method: 'POST',
        });

    const { loading: LoadingEditProject, fetchData: handleEditProject } =
        useFetchData(`/projects/${selectedProjectForUpdate.id}`, {
            method: 'PATCH',
        });

    const { loading: LoadingDeleteProject, fetchData: handleDeleteProject } =
        useFetchData(`/projects/${selectedProjectForUpdate.id}`, {
            method: 'DELETE',
        });

    useEffect(() => {
        handleFetchProjects();
    }, [handleFetchProjects]);

    useEffect(() => {
        if (selectedProjectForCreate.id) {
            fetchData();
        }
    }, [fetchData, selectedProjectForCreate]);

    const handleConfirmAction = async (projectName: string) => {
        const actions: Record<string, () => Promise<void>> = {
            add: async () => {
                await handleAddProject({ name: projectName });
                setSelectedProjectForUpdate({ id: '', name: '' });
            },
            edit: async () => {
                if (selectedProjectForCreate) {
                    await handleEditProject({ name: projectName });
                    setSelectedProjectForUpdate({ id: '', name: '' });
                }
            },
            delete: async () => {
                if (selectedProjectForUpdate.id) {
                    await handleDeleteProject();
                }
            },
        };

        if (actions[dialogAction]) {
            await actions[dialogAction]();
            await handleFetchProjects();
        }
    };

    const onCloseProjectDialog = () => {
        setDialogOpen(false);
        setSelectedProjectForUpdate({ id: '', name: '' });
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
                    setSelectedProjectForUpdate={setSelectedProjectForUpdate}
                    setSelectedProjectForCreate={setSelectedProjectForCreate}
                />
            </GridSidebar>
            <GridAudioList item xs={10}>
                {isAdmin && (
                    <AddAudioRecordForm
                        author={user.email}
                        project={selectedProjectForCreate.name}
                        projectId={selectedProjectForCreate.id}
                        fetchData={fetchData}
                    />
                )}
                <AudioRecordsTable
                    audioRecords={audioRecords}
                    loading={loading}
                    fetchData={fetchData}
                />
            </GridAudioList>
            <ProjectDialog
                open={dialogOpen}
                onClose={onCloseProjectDialog}
                onConfirm={handleConfirmAction}
                actionType={dialogAction}
                projectName={selectedProjectForUpdate.name}
            />
        </Grid>
    );
};

export default ProjectsPage;
