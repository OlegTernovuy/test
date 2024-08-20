import { useState, useEffect, useCallback } from 'react';

import {
    CircularProgressWrapper,
    GridAudioList,
    GridSidebar,
} from '../styled/ProjectsPage.styled';
import { CircularProgress, Grid, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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

const ProjectsPage = () => {
    const { isAdmin } = useAuth();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<'add' | 'edit' | 'delete'>(
        'add'
    );
    const [selectedProjectName, setSelectedProjectName] = useState<IProjects>({
        id: '',
        name: '',
    });
    const [selectedProjectId, setSelectedProjectId] = useState('');

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

    const onCloseProjectDialog = () => {
        setDialogOpen(false);
        setSelectedProjectName({ id: '', name: '' });
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
                    setSelectedProjectName={setSelectedProjectName}
                    setSelectedProjectId={setSelectedProjectId}
                />
            </GridSidebar>
            <GridAudioList item xs={10}>
                {isAdmin && <CustomMediaRecorder />}
                <AudioRecordsTable
                    audioRecords={audioRecords}
                    loading={loading}
                    onOpenAudioRecordDialog={onOpenAudioRecordDialog}
                    setAudioDialogAction={setAudioDialogAction}
                    onSelect={(record) => setSelectedAudioRecord(record)}
                />
                {isAdmin && projects.length > 0 && (
                    <IconButton
                        onClick={() => {
                            onOpenAudioRecordDialog();
                            setAudioDialogAction('add');
                        }}
                    >
                        <AddCircleOutlineIcon
                            color="primary"
                            fontSize="large"
                        />
                    </IconButton>
                )}
            </GridAudioList>
            <ProjectDialog
                open={dialogOpen}
                onClose={onCloseProjectDialog}
                onConfirm={handleConfirmAction}
                actionType={dialogAction}
                projectName={selectedProjectName.name}
            />
            <AudioRecordDialog
                open={audioDialogOpen}
                onClose={onCloseAudioRecordDialog}
                projectId={selectedProjectId}
                fetchData={fetchData}
                actionType={audioDialogAction}
                selectedAudioRecord={selectedAudioRecord}
            />
        </Grid>
    );
};

export default ProjectsPage;
