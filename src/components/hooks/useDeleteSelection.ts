import { useCallback } from "react";
import { useAppDispatch } from "../../store/hooks";
import { removeObjects, removeSlides } from "../../store/slices/presentationSlice";
import { clearSelection, closeContextMenu, setSelectedObjects } from "../../store/slices/viewModelSlice";

function useDeleteSelection() {
    const dispatch = useAppDispatch();

    const deleteSlides = useCallback((slideIds: string[]) => {
        dispatch(removeSlides({ slideIds }));
        dispatch(clearSelection());
        dispatch(closeContextMenu());
    }, [dispatch]);

    const deleteObjects = useCallback((slideId: string, objectIds: string[]) => {
        dispatch(removeObjects({ slideId, objectIds }));
        dispatch(setSelectedObjects([]));
        dispatch(closeContextMenu());
    }, [dispatch]);

    return { deleteSlides, deleteObjects };
}

export { useDeleteSelection };
