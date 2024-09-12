import { DropResult } from '@hello-pangea/dnd';

type UpdateOrderFunctionWithId = (
    projectId: string,
    reorderedItems: any[]
) => void;
type UpdateOrderFunctionWithoutId = (reorderedItems: any[]) => void;
type FetchDataFunctionWithId = (projectId: string) => void;
type FetchDataFunctionWithoutId = () => void;

const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

interface UseDragAndDropProps<T> {
    items: T[];
    onReorder: (reorderedItems: T[]) => void;
    updateOrder: UpdateOrderFunctionWithId | UpdateOrderFunctionWithoutId;
    fetchData: FetchDataFunctionWithId | FetchDataFunctionWithoutId;
    projectId?: string;
}

const useDragAndDrop = <T>({
    items,
    onReorder,
    updateOrder,
    fetchData,
    projectId,
}: UseDragAndDropProps<T>) => {
    const onDragEnd = async ({ destination, source }: DropResult) => {
        if (!destination) return;

        const newItems = reorder<T>(items, source.index, destination.index);

        const reorderedItems = newItems.map((item, index) => ({
            ...item,
            index: newItems.length - index,
        }));

        onReorder(reorderedItems);

        try {
            if (projectId && fetchData) {
                await (updateOrder as UpdateOrderFunctionWithId)(
                    projectId,
                    reorderedItems
                );
                await (fetchData as FetchDataFunctionWithId)(projectId);
            } else {
                await (updateOrder as UpdateOrderFunctionWithoutId)(
                    reorderedItems
                );
                await (fetchData as FetchDataFunctionWithoutId)();
            }
        } catch (error) {
            console.log('Error updating order:', error);
        }
    };

    return onDragEnd;
};

export default useDragAndDrop;
