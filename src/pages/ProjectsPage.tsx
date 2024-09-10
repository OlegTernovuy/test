import { useState, useEffect, useCallback } from 'react';

import {
    MenuAudioFormHeaderStyled,
    ProfileBlockStyled,
    ProjectPageHeaderStyled,
} from '../styled/ProjectsPage.styled';
import {
    AudioRecordsTable,
    Sidebar,
    AddAudioRecordForm,
    AddVideoRecordForm,
    VideoRecordsTable,
    CustomSelect,
} from '../components';
import {
    Avatar,
    Box,
    Button,
    IconButton,
    Typography,
    Tab,
    Stack,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import MenuIcon from '@mui/icons-material/Menu';

import { useAuth } from '../Providers/AuthProvider';
import { useFetchProject } from '../services/Projects.service';
import { useFetchAudioRecords } from '../services/Media.service';
import { IProjects } from '../types';
import { useAudioSettings } from '../Providers/AudioSettingsProvider';

const ProjectsPage = () => {
    const { isAdmin, user, logout } = useAuth();

    const { selectorOutput } = useAudioSettings();

    const [open, setOpen] = useState(false);

    const [selectedTab, setSelectedTab] = useState<'audio' | 'video'>('audio');

    const toggleDrawer = useCallback(() => {
        setOpen((prevOpen) => {
            return !prevOpen;
        });
    }, []);

    //store data about the currently selected project
    const [selectedProjectForCreate, setSelectedProjectForCreate] = useState<{
        id: string;
        name: string;
    }>({
        id: '',
        name: '',
    });

    const {
        data: projects,
        fetchProjects,
        updatedProjects,
    } = useFetchProject();

    const handleReorder = useCallback(
        (reorderedProjects: IProjects[]) => {
            updatedProjects(reorderedProjects);
        },
        [updatedProjects]
    );

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
                onReorder={handleReorder}
                setSelectedProjectForCreate={setSelectedProjectForCreate}
                open={open}
                toggleDrawer={toggleDrawer}
                fetchProjects={fetchProjects}
            />
            <Box>
                <TabContext value={selectedTab}>
                    <ProjectPageHeaderStyled>
                        <MenuAudioFormHeaderStyled>
                            <Button
                                aria-label="show sidebar"
                                onClick={() => toggleDrawer()}
                            >
                                <MenuIcon fontSize="large" />
                            </Button>
                            <TabList
                                onChange={(_, newValue) =>
                                    setSelectedTab(newValue)
                                }
                            >
                                <Tab label="Audio" value="audio" />
                                <Tab label="Video" value="video" />
                            </TabList>
                            {!isAdmin && <CustomSelect {...selectorOutput} />}
                        </MenuAudioFormHeaderStyled>
                        <ProfileBlockStyled>
                            <Typography variant="body2">
                                {user.email}
                            </Typography>
                            <IconButton onClick={logout}>
                                <Avatar>L</Avatar>
                            </IconButton>
                        </ProfileBlockStyled>
                    </ProjectPageHeaderStyled>
                    <TabPanel value="audio">
                        <Stack spacing={2}>
                            {isAdmin && (
                                <AddAudioRecordForm
                                    author={user.email}
                                    project={selectedProjectForCreate.name}
                                    projectId={selectedProjectForCreate.id}
                                    fetchData={fetchAudioRecord}
                                />
                            )}
                            <AudioRecordsTable
                                audioRecords={audioRecords}
                                loading={loading}
                                fetchData={fetchAudioRecord}
                                projectId={selectedProjectForCreate}
                            />
                        </Stack>
                    </TabPanel>
                    <TabPanel value="video">
                        <Stack spacing={2}>
                            {isAdmin && (
                                <AddVideoRecordForm
                                    author={user.email}
                                    project={selectedProjectForCreate.name}
                                    projectId={selectedProjectForCreate.id}
                                    fetchData={fetchAudioRecord}
                                />
                            )}
                            <VideoRecordsTable />
                        </Stack>
                    </TabPanel>
                </TabContext>
            </Box>
        </Box>
    );
};

export default ProjectsPage;