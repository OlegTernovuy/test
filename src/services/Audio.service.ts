import { useState } from 'react';

import { useFetch } from '../hook';
import { IAudioRecord } from '../types';
import axios from '../utils/axios';

interface IAddAudioRecord {
    name: string;
    comment?: string;
    author: string;
    audioFileUrl: string;
}

export interface IUpdateAudioRecord {
    name?: string;
    comment?: string;
    audioFileUrl?: string;
}

const useFetchAudioRecords = () => {
    const [data, setData] = useState<IAudioRecord[]>([]);
    const { loading, error, makeRequest } = useFetch();

    const fetchAudioRecord = async (projectId: string) => {
        try {
            const result = await makeRequest({
                url: `/audio/${projectId}`,
                method: 'GET',
                withCredentials: true,
            });

            setData(result.data);
        } catch (err) {
            console.error('Failed to fetch audio records', err);
            setData([]);
        }
    };

    const updatedAudioRecords = (orderedAudioRecords: any) => {
        setData(orderedAudioRecords);
    };

    return { data, fetchAudioRecord, updatedAudioRecords, loading, error };
};

const putMedia = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/audioFile?project=loki', formData, {
        withCredentials: true,
    });

    return res.data;
};

const addAudioRecord = async (projectId: string, data: IAddAudioRecord) => {
    try {
        await axios.post(
            `/audio?projectId=${projectId}`,
            {
                name: data.name,
                comment: data.comment,
                author: data.author,
                audioFileUrl: data.audioFileUrl,
            },
            { withCredentials: true }
        );
    } catch (error) {
        console.error('Error add new audio record', error);
    }
};

const updateAudioRecord = async (
    projectId: string,
    audioRecordId: string,
    data: IUpdateAudioRecord
) => {
    try {
        const filteredData = { ...data };

        await axios.patch(
            `/audio/${audioRecordId}?projectId=${projectId}`,
            filteredData,
            {
                withCredentials: true,
            }
        );
    } catch (error) {
        console.error('Error update audio record', error);
    }
};

const updateAudioFile = async (file: File, oldFileUrl: string) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('oldFileUrl', oldFileUrl);
        const res = await axios.patch('/audioFile?project=loki', formData, {
            withCredentials: true,
        });

        return res.data;
    } catch (error) {
        console.error('Error update audio record', error);
    }
};

const useDeleteAudioRecord = () => {
    const { loading, error, makeRequest } = useFetch();

    const deleteAudioRecord = async (
        projectId: string,
        audioRecordId: string,
        audioFileUrl: string
    ) => {
        try {
            await makeRequest({
                url: `audioFile`,
                method: 'DELETE',
                data: { audioFileUrl },
                withCredentials: true,
            });
            await makeRequest({
                url: `/audio/${audioRecordId}?projectId=${projectId}`,
                method: 'DELETE',
                withCredentials: true,
            });
        } catch (err) {
            console.error('Failed to delete audio record', err);
        }
    };

    return { deleteAudioRecord, loading, error };
};

const useUpdateAudioRecordsOrder = () => {
    const { loading, error, makeRequest, clearError } = useFetch();

    const updateAudioRecordsOrder = async (
        projectId: string,
        updatedAudioRecords: IAudioRecord[]
    ) => {
        await makeRequest({
            url: `/audioOrder?projectId=${projectId}`,
            method: 'POST',
            data: { updatedAudioRecords },
            withCredentials: true,
        });
    };

    return { updateAudioRecordsOrder, loading, error, clearError };
};

const useMoveAudioRecords = () => {
    const { loading, error, makeRequest } = useFetch();

    const moveAudioRecords = async (
        oldProjectId: string,
        newProjectId: string,
        audioRecordId: string,
        audioRecordData: Omit<IAudioRecord, 'id' | 'index'>
    ) => {
        await makeRequest({
            url: `/moveAudioRecord`,
            method: 'POST',
            data: {
                oldProjectId,
                newProjectId,
                audioRecordId,
                audioRecordData,
            },
            withCredentials: true,
        });
    };

    return { moveAudioRecords, loading, error };
};

export {
    useFetchAudioRecords,
    putMedia,
    addAudioRecord,
    updateAudioRecord,
    updateAudioFile,
    useDeleteAudioRecord,
    useUpdateAudioRecordsOrder,
    useMoveAudioRecords,
};
