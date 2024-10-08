import { useState, useEffect, useCallback } from 'react';
import {
    Avatar,
    Box,
    Button,
    IconButton,
    Typography,
    Stack,
    Tab,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import {
    MenuAudioFormHeaderStyled,
    ProfileBlockStyled,
    ProjectPageHeaderStyled,
    ProjectsPageMainBlock,
} from '../styled/ProjectsPage.styled';
import {
    AudioRecordsTable,
    Sidebar,
    AddAudioRecordForm,
    CustomSelect,
    AddVideoRecordForm,
    VideoRecordsTable,
} from '../components';

import { useAuth, useMediaSettings } from '../Providers/index';
import { useFetchProject } from '../services/Projects.service';
import { useFetchAudioRecords } from '../services/Audio.service';
import { useFetchVideoRecords } from '../services/Video.service';
import { IAudioRecord, IProjects, IVideoRecord } from '../types';

const ProjectsPage = () => {
    const { isAdmin, user, logout } = useAuth();

    const {
        audioDevices: { selectorOutput },
    } = useMediaSettings();

    const [open, setOpen] = useState(true);

    const [selectedTab, setSelectedTab] = useState<'audio' | 'video'>('audio');

    const toggleDrawer = useCallback(() => {
        setOpen((prevOpen) => !prevOpen);
    }, []);

    // Store data about the currently selected project
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
        updatedAudioRecords,
        loading: audioLoading,
    } = useFetchAudioRecords();
    const {
        data: videoRecords,
        fetchVideoRecord,
        updatedVideoRecords,
        loading: videoLoading,
    } = useFetchVideoRecords();

    const handleReorderAudioRecords = useCallback(
        (reorderedAudioRecords: IAudioRecord[]) => {
            updatedAudioRecords(reorderedAudioRecords);
        },
        [updatedAudioRecords]
    );

    const handleReorderVideoRecords = useCallback(
        (reorderedVideoRecords: IVideoRecord[]) => {
            updatedVideoRecords(reorderedVideoRecords);
        },
        [updatedVideoRecords]
    );

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProjectForCreate.id) {
            fetchAudioRecord(selectedProjectForCreate.id);
            fetchVideoRecord(selectedProjectForCreate.id);
        }
    }, [selectedProjectForCreate.id]);

    const showVideoTab = isAdmin || videoRecords.length > 0;

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
            <ProjectsPageMainBlock $open={open}>
                <TabContext value={selectedTab}>
                    <ProjectPageHeaderStyled $startItems={isAdmin}>
                        <MenuAudioFormHeaderStyled $startItems={isAdmin}>
                            {!open && (
                                <Button
                                    aria-label="show sidebar"
                                    onClick={toggleDrawer}
                                >
                                    <MenuIcon fontSize="large" />
                                </Button>
                            )}
                            {showVideoTab ? (
                                <TabList
                                    onChange={(_, newValue) =>
                                        setSelectedTab(newValue)
                                    }
                                >
                                    <Tab label="Audio" value="audio" />
                                    <Tab label="Video" value="video" />
                                </TabList>
                            ) : (
                                <CustomSelect {...selectorOutput} />
                            )}
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
                    <>
                        <TabPanel value="audio">
                            <Stack spacing={2}>
                                {isAdmin ? (
                                    <AddAudioRecordForm
                                        author={user.email}
                                        project={selectedProjectForCreate.name}
                                        projectId={selectedProjectForCreate.id}
                                        fetchData={fetchAudioRecord}
                                    />
                                ) : showVideoTab ? (
                                    <CustomSelect {...selectorOutput} />
                                ) : (
                                    ''
                                )}
                                <AudioRecordsTable
                                    audioRecords={audioRecords}
                                    loading={audioLoading}
                                    fetchData={fetchAudioRecord}
                                    onReorder={handleReorderAudioRecords}
                                    projectId={selectedProjectForCreate}
                                    projects={projects}
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
                                        fetchData={fetchVideoRecord}
                                    />
                                )}
                                <VideoRecordsTable
                                    videoRecords={videoRecords}
                                    loading={videoLoading}
                                    fetchData={fetchVideoRecord}
                                    onReorder={handleReorderVideoRecords}
                                    projectId={selectedProjectForCreate}
                                    projects={projects}
                                />
                            </Stack>
                        </TabPanel>
                    </>
                </TabContext>
            </ProjectsPageMainBlock>
        </Box>
    );
};

export default ProjectsPage;
