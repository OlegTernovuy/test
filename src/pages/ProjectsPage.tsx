import { useState, useEffect } from 'react';

import {
    MenuAudioFormHeaderStyled,
    ProjectPageHeaderStyled,
} from '../styled/ProjectsPage.styled';
import { AudioRecordsTable, Sidebar, AddAudioRecordForm } from '../components';
import { Avatar, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { useAuth } from '../Providers/AuthProvider';
import { useFetchProject } from '../services/Projects.service';
import { useFetchAudioRecords } from '../services/Media.service';
import { IProjects } from '../types';

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

    const { data: projects, fetchProjects } = useFetchProject();
    const {
        data: audioRecords,
        fetchAudioRecord,
        loading,
    } = useFetchAudioRecords();

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProjectForCreate.id) {
            fetchAudioRecord(selectedProjectForCreate.id);
        }
    }, [selectedProjectForCreate]);

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
                    <MenuAudioFormHeaderStyled>
                        <Button onClick={() => toggleDrawer()}>
                            <MenuIcon fontSize="large" />
                        </Button>
                        {isAdmin && (
                            <AddAudioRecordForm
                                author={user.email}
                                project={selectedProjectForCreate.name}
                                projectId={selectedProjectForCreate.id}
                                fetchData={fetchAudioRecord}
                            />
                        )}
                    </MenuAudioFormHeaderStyled>
                    <Avatar>L</Avatar>
                </ProjectPageHeaderStyled>
                <AudioRecordsTable
                    audioRecords={audioRecords}
                    loading={loading}
                    fetchData={fetchAudioRecord}
                    projectId={selectedProjectForCreate}
                />
            </Box>
        </Box>
    );
};

export default ProjectsPage;
