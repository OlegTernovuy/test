import { useState, useEffect, useCallback } from 'react';

import { ProjectPageHeaderStyled } from '../styled/ProjectsPage.styled';
import { AudioRecordsTable, Sidebar, AddAudioRecordForm } from '../components';
import { Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import useFetchData from '../hook/useFetch';
import { IAudioRecord, IProjects } from '../types';
import { useAuth } from '../Providers/AuthProvider';

const ProjectsPage = () => {
    const { isAdmin, user } = useAuth();

    const [open, setOpen] = useState(false);

    const toggleDrawer = () => {
        setOpen((prevOpen) => {
            return !prevOpen;
        });
    };

    //store data about the currently selected project
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

    useEffect(() => {
        handleFetchProjects();
    }, [handleFetchProjects]);

    useEffect(() => {
        if (selectedProjectForCreate.id) {
            fetchData();
        }
    }, [fetchData, selectedProjectForCreate]);

    return (
        <Box>
            <Sidebar
                projects={projects}
                setSelectedProjectForCreate={setSelectedProjectForCreate}
                open={open}
                toggleDrawer={toggleDrawer}
                fetchProjects={fetchProjects}
            />
            <Box>
                <ProjectPageHeaderStyled>
                    <Button onClick={() => toggleDrawer()}>
                        <MenuIcon fontSize="large" />
                    </Button>
                    {isAdmin && (
                        <AddAudioRecordForm
                            author={user.email}
                            project={selectedProjectForCreate.name}
                            projectId={selectedProjectForCreate.id}
                            fetchData={fetchData}
                        />
                    )}
                </ProjectPageHeaderStyled>
                <AudioRecordsTable
                    audioRecords={audioRecords}
                    loading={loading}
                    fetchData={fetchData}
                />
            </Box>
        </Box>
    );
};

export default ProjectsPage;
