import { useGridApiRef } from '@mui/x-data-grid';

const useVideoEditingHandlers = (formik: any, clearBlobUrl: () => void) => {
    const apiRef = useGridApiRef();

    const startEditingMultipleFields = (id: string, fields: string[]) => {
        fields.forEach((field) => {
            apiRef.current.startCellEditMode({ id, field });
        });
    };

    const stopEditingMultipleFields = (id: string, fields: string[]) => {
        fields.forEach((field) => {
            apiRef.current.stopCellEditMode({ id, field });
        });
    };

    const cancelEditingMultipleFields = (id: string, fields: string[]) => {
        fields.forEach((field) => {
            apiRef.current.setEditCellValue(
                { id, field, value: null },
                { debounceMs: 200 }
            );
            apiRef.current.stopCellEditMode({
                id,
                field,
                ignoreModifications: true,
            });
        });
    };

    const startEditing = (id: string) => {
        clearBlobUrl();
        startEditingMultipleFields(id, ['name', 'comment', 'video', 'actions']);
    };

    const stopEditing = async (id: string) => {
        if (apiRef.current) {
            const updatedData = apiRef.current.getRowWithUpdatedValues(
                id,
                'comment'
            );

            stopEditingMultipleFields(id, [
                'name',
                'comment',
                'video',
                'actions',
            ]);

            formik.setValues({
                editingRecordId: updatedData.id,
                name: updatedData.name,
                author: updatedData.author,
                comment: updatedData.comment,
                videoFileUrl: updatedData.videoFileUrl,
            });

            await formik.validateForm();

            if (formik.isValid) {
                await formik.handleSubmit();
            }
        }
    };

    const cancelEditing = (id: string) => {
        cancelEditingMultipleFields(id, [
            'name',
            'comment',
            'video',
            'actions',
        ]);
    };

    return {
        apiRef,
        startEditing,
        stopEditing,
        cancelEditing,
    };
};

export default useVideoEditingHandlers;
