import axios from '../utils/axios';

interface IAddAudioRecord {
    name: string;
    comment?: string;
    author: string;
    project: string;
    projectId: string;
    audioFileUrl: string;
}

interface IUpdateAudioRecord {
    name?: string;
    author?: string;
    project?: string;
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
                comment: data.comment,
                author: data.author,
                project: data.project,
                projectId: data.projectId,
                audioFileUrl: data.audioFileUrl,
            },
            { withCredentials: true }
        );
    } catch (error) {
        console.error('Error add new audio record', error);
    }
};

const updateAudioRecord = async (
    audioRecordId: string,
    data: IUpdateAudioRecord
) => {
    try {
        await axios.post(
            `/audio/${audioRecordId}`,
            {
                name: data.name,
                author: data.author,
                project: data.project,
            },
            { withCredentials: true }
        );
    } catch (error) {
        console.error('Error update audio record', error);
    }
};

const deleteAudioRecord = async (audioRecordId: string) => {
    try {
        await axios.delete(`/audio/${audioRecordId}`, {
            withCredentials: true,
        });
    } catch (error) {
        console.error('Error delete audio record', error);
    }
};

const deleteAudioFile = async (audioFileUrl: string) => {
    try {
        await axios.delete(`/audioFile`, {
            data: { audioFileUrl },
            withCredentials: true,
        });
    } catch (error) {
        console.error('Error delete audio file', error);
    }
};

export {
    getMedia,
    putMedia,
    addAudioRecord,
    deleteAudioRecord,
    updateAudioRecord,
    deleteAudioFile,
};
