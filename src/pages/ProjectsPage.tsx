import { useState, useEffect, useCallback } from 'react';

import {
    CircularProgressWrapper,
    GridAudioList,
    GridSidebar,
} from '../styled/ProjectsPage.styled';
import { CircularProgress, Grid } from '@mui/material';
import {
    AudioRecordDialog,
    AudioRecordsTable,
    CustomMediaRecorder,
    ProjectDialog,
    Sidebar,
} from '../components';

import useFetchData from '../hook/useFetch';
import { IAudioRecord, IProjects } from '../types';
import { useAuth } from '../Providers/AuthProvider';
import AddAudioRecordForm from '../components/ProjectsPage/AddAudioRecordForm';

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

    const [audioDialogOpen, setAudioDialogOpen] = useState(false);
    const [audioDialogAction, setAudioDialogAction] = useState<
        'add' | 'edit' | 'delete'
    >('add');
    const [selectedAudioRecord, setSelectedAudioRecord] =
        useState<IAudioRecord | null>(null);

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

    const onOpenAudioRecordDialog = () => {
        setAudioDialogOpen(true);
    };

    const onCloseAudioRecordDialog = () => {
        setAudioDialogOpen(false);
        setSelectedAudioRecord(null);
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
                    <CustomMediaRecorder
                        author={user.email}
                        project={selectedProjectForCreate.name}
                        projectId={selectedProjectForCreate.id}
                        fetchData={fetchData}
                    />
                )}
                <AudioRecordsTable
                    audioRecords={audioRecords}
                    loading={loading}
                    onOpenAudioRecordDialog={onOpenAudioRecordDialog}
                    setAudioDialogAction={setAudioDialogAction}
                    onSelect={(record) => setSelectedAudioRecord(record)}
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
            <AudioRecordDialog
                open={audioDialogOpen}
                onClose={onCloseAudioRecordDialog}
                projectId={selectedProjectForCreate.id}
                fetchData={fetchData}
                actionType={audioDialogAction}
                selectedAudioRecord={selectedAudioRecord}
            />
        </Grid>
    );
};

export default ProjectsPage;
