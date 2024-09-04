import { useState } from 'react';

import useFetch from '../hook/useFetch';
import { IProjects } from '../types';

const useFetchProject = () => {
    const [data, setData] = useState<IProjects[]>([]);
    const { loading, error, makeRequest } = useFetch();

    const fetchProjects = async () => {
        try {
            const result = await makeRequest({
                url: '/projects',
                method: 'GET',
                withCredentials: true,
            });

            setData(result.data);
        } catch (err) {
            console.error('Failed to fetch projects', err);
            setData([]);
        }
    };

    return { data, fetchProjects, loading, error };
};

const useAddProject = () => {
    const { loading, error, makeRequest, clearError } = useFetch();

    const addProject = async (projectName: string, onSuccess: () => void) => {
        await makeRequest(
            {
                url: '/projects',
                method: 'POST',
                data: { name: projectName },
                withCredentials: true,
            },
            { onSuccess }
        );
    };

    return { addProject, loading, error, clearError };
};

const useEditProject = () => {
    const { loading, error, makeRequest, clearError } = useFetch();

    const editProject = async (
        projectId: string,
        projectName: string,
        onSuccess: () => void
    ) => {
        await makeRequest(
            {
                url: `/projects/${projectId}`,
                method: 'PATCH',
                data: { name: projectName },
                withCredentials: true,
            },
            { onSuccess }
        );
    };

    return { editProject, loading, error, clearError };
};

const useDeleteProject = () => {
    const { loading, error, makeRequest } = useFetch();

    const deleteProject = async (projectId: string, onSuccess: () => void) => {
        await makeRequest(
            {
                url: `/projects/${projectId}`,
                method: 'DELETE',
                withCredentials: true,
            },
            { onSuccess }
        );
    };

    return { deleteProject, loading, error };
};

export { useFetchProject, useAddProject, useEditProject, useDeleteProject };
