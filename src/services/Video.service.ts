import { useState } from 'react';

import { useFetch } from '../hook';
import { IVideoRecord } from '../types';
import axios from '../utils/axios';

interface IAddVideoRecord {
    name: string;
    comment?: string;
    author: string;
    videoFileUrl: string;
}

export interface IUpdateVideoRecord {
    name?: string;
    comment?: string;
    videoFileUrl?: string;
}

const useFetchVideoRecords = () => {
    const [data, setData] = useState<IVideoRecord[]>([]);
    const { loading, error, makeRequest } = useFetch();

    const fetchVideoRecord = async (projectId: string) => {
        try {
            const result = await makeRequest({
                url: `/video/${projectId}`,
                method: 'GET',
                withCredentials: true,
            });

            setData(result.data);
        } catch (err) {
            console.error('Failed to fetch video records', err);
            setData([]);
        }
    };

    return { data, fetchVideoRecord, loading, error };
};

const putVideo = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/videoFile?project=loki-video', formData, {
        withCredentials: true,
    });

    return res.data;
};

const addVideoRecord = async (projectId: string, data: IAddVideoRecord) => {
    try {
        await axios.post(
            `/video?projectId=${projectId}`,
            {
                name: data.name,
                comment: data.comment,
                author: data.author,
                videoFileUrl: data.videoFileUrl,
            },
            { withCredentials: true }
        );
    } catch (error) {
        console.error('Error add new video record', error);
    }
};

const updateVideoRecord = async (
    projectId: string,
    videoRecordId: string,
    data: IUpdateVideoRecord
) => {
    try {
        const filteredData = { ...data };

        await axios.patch(
            `/video/${videoRecordId}?projectId=${projectId}`,
            filteredData,
            {
                withCredentials: true,
            }
        );
    } catch (error) {
        console.error('Error update video record', error);
    }
};

const updateVideoFile = async (file: File, oldFileUrl: string) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('oldFileUrl', oldFileUrl);
        const res = await axios.patch(
            '/videoFile?project=loki-video',
            formData,
            {
                withCredentials: true,
            }
        );

        return res.data;
    } catch (error) {
        console.error('Error update video record', error);
    }
};

const useDeleteVideoRecord = () => {
    const { loading, error, makeRequest } = useFetch();

    const deleteVideoRecord = async (
        projectId: string,
        videoRecordId: string,
        videoFileUrl: string
    ) => {
        try {
            await makeRequest({
                url: `videoFile`,
                method: 'DELETE',
                data: { videoFileUrl },
                withCredentials: true,
            });
            await makeRequest({
                url: `/video/${videoRecordId}?projectId=${projectId}`,
                method: 'DELETE',
                withCredentials: true,
            });
        } catch (err) {
            console.error('Failed to delete video record', err);
        }
    };

    return { deleteVideoRecord, loading, error };
};

const useMoveVideoRecords = () => {
    const { loading, error, makeRequest } = useFetch();

    const moveVideoRecords = async (
        oldProjectId: string,
        newProjectId: string,
        videoRecordId: string,
        videoRecordData: Omit<IVideoRecord, 'id' | 'index'>
    ) => {
        await makeRequest({
            url: `/moveVideoRecord`,
            method: 'POST',
            data: {
                oldProjectId,
                newProjectId,
                videoRecordId,
                videoRecordData,
            },
            withCredentials: true,
        });
    };

    return { moveVideoRecords, loading, error };
};

export {
    useFetchVideoRecords,
    putVideo,
    addVideoRecord,
    updateVideoRecord,
    updateVideoFile,
    useDeleteVideoRecord,
    useMoveVideoRecords,
};
