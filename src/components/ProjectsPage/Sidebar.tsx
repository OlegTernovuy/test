import React, { useEffect, useState } from 'react';

import { SidebarHeader } from '../../styled/ProjectsPage.styled';
import { Tab, Tabs } from '@mui/material';

import { getProjects } from '../../services/Projects.service';
import { IAudioRecord } from '../../types';
import axios from '../../utils/axios';

interface IProjects {
    id: string;
    name: string;
}

interface ISidebarProps {
    setAudioRecords: React.Dispatch<React.SetStateAction<IAudioRecord[]>>;
    setLoadings: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ setAudioRecords, setLoadings }: ISidebarProps) => {
    const [projects, setProjects] = useState<IProjects[]>([]);
    const [selectProject, setSelectProject] = useState(0);

    useEffect(() => {
        const Projects = async () => {
            const res = await getProjects();
            setProjects(res?.data.data);
        };
        Projects();
    }, []);

    const handleAudioRecords = async (projectId: string) => {
        // const res = await getAudioRecords(projectId);
        try {
            setLoadings(true);
            const res = await axios.get(`/audio/${projectId}`, {
                withCredentials: true,
            });
            setAudioRecords(res?.data.data);
        } catch (error) {
            console.error(error);
            setLoadings(false);
        } finally {
            setLoadings(false);
        }
    };

    const handleSelectProject = (
        event: React.SyntheticEvent,
        newProject: number
    ) => {
        setSelectProject(newProject);
    };
    return (
        <>
            <SidebarHeader variant="h6">Projects name</SidebarHeader>
            <Tabs
                value={selectProject}
                onChange={handleSelectProject}
                orientation="vertical"
            >
                {projects &&
                    projects.map((project) => (
                        <Tab
                            key={project.id}
                            label={project.name}
                            onClick={() => handleAudioRecords(project.id)}
                        />
                    ))}
            </Tabs>
        </>
    );
};

export default Sidebar;
