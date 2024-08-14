import React, { useEffect, useState } from 'react';

import { SidebarHeader } from '../../styled/ProjectsPage.styled';
import { Tab, Tabs } from '@mui/material';

import useFetchData from '../../hook/useFetch';

interface IProjects {
    id: string;
    name: string;
}

interface ISidebarProps {
    setSelectedProjectId: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar = ({ setSelectedProjectId }: ISidebarProps) => {
    const [selectProject, setSelectProject] = useState(0);

    const handleSelectProject = (
        event: React.SyntheticEvent,
        newProject: number
    ) => {
        setSelectProject(newProject);
    };

    const { data: projects, fetchData } =
        useFetchData<IProjects[]>(`/projects`);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (projects && projects[selectProject]?.id) {
            setSelectedProjectId(projects[selectProject].id);
        }
    }, [projects, selectProject, setSelectedProjectId]);

    return (
        <>
            <SidebarHeader variant="h6">Projects</SidebarHeader>
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
                            onClick={() => setSelectedProjectId(project.id)}
                        />
                    ))}
            </Tabs>
        </>
    );
};

export default Sidebar;
