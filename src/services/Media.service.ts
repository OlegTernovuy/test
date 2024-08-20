import axios from '../utils/axios';

const getMedia = async () => {
    const res = await axios.get('/audioFile?project=loki');

    return res.data;
};

const putMedia = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/audioFile?project=loki', formData);

    return res.data;
};

export {
    getMedia,
    putMedia
};
