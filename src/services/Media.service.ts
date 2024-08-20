import axios from '../utils/axios';

interface IAddAudioRecord {
    name: string;
    author: string;
    project: string;
    projectId: string;
}

const getMedia = async () => {
    const res = await axios.get('/audioFile?project=loki', {
        withCredentials: true,
    });

    return res.data;
};

const putMedia = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/audioFile?project=loki', formData, {
        withCredentials: true,
    });

    return res.data;
};

const addAudioRecord = async (data: IAddAudioRecord) => {
    try {
        await axios.post(
            '/audio',
            {
                name: data.name,
                author: data.author,
                project: data.project,
                projectId: data.projectId,
            },
            { withCredentials: true }
        );
    } catch (error) {
        console.error('Error add new audio record', error);
    }
};

const deleteAudioRecord = async (audioRecordId: string) => {
    try {
        await axios.delete(`/audio/${audioRecordId}`, { withCredentials: true });
    } catch (error) {
        console.error('Error delete audio record', error);
    }
};

export { getMedia, putMedia, addAudioRecord, deleteAudioRecord };
