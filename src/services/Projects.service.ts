import axios from '../utils/axios';

const getProjects = async () => {
    try {
        return await axios.get('/projects', {
            withCredentials: true,
        });
    } catch (error) {
        console.error(error);
    }
};

const getAudioRecords = async (projectId: string) => {
    try {
        return await axios.get(`/audio/${projectId}`, {
            withCredentials: true,
        });
    } catch (error) {
        console.error(error);
    }
};

export { getProjects, getAudioRecords };
