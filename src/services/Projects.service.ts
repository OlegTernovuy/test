import axios from '../utils/axios';

const handleAddProject = async (projectName: string) => {
    try {
        await axios.post(
            '/projects',
            { name: projectName },
            { withCredentials: true }
        );
    } catch (error) {
        console.error('Error logout', error);
    }
};

const handleEditProject = async (projectName: string, projectId: string) => {
    try {
        await axios.patch(
            `/projects/${projectId}`,
            { name: projectName },
            { withCredentials: true }
        );
    } catch (error) {
        console.error('Error logout', error);
    }
};

const handleDeleteProject = async (projectId: string) => {
    try {
        await axios.delete(`/projects/${projectId}`, { withCredentials: true });
    } catch (error) {
        console.error('Error logout', error);
    }
};

export { handleAddProject, handleEditProject, handleDeleteProject };
