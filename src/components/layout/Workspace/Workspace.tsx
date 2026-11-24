import { useAppSelector } from "../../../store/hooks";
import { selectActiveSlide } from "../../../store/selectors";
import { useEffect, useRef } from "react";
import { useDeleteSelection } from "../../hooks/useDeleteSelection";
import { isEditableTarget } from "../../utils/isEditableTarget";
import styles from "./Workspace.module.css";
import { SlideView } from "../../slides/SlideView/SlideView";

function Workspace() {
    const activeSlideId = useAppSelector(state => state.viewModel.activeSlideId);
    const selectedObjectIds = useAppSelector(state => state.viewModel.selectedObjectIds);
    const selectionTarget = useAppSelector(state => state.viewModel.selectionTarget);
    const activeSlide = useAppSelector(selectActiveSlide);
    const workspaceRef = useRef<HTMLDivElement>(null);
    const { deleteObjects } = useDeleteSelection();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Delete" || event.defaultPrevented) return;
            if (isEditableTarget(event.target)) return;
            if (selectionTarget !== "objects" || !activeSlideId || selectedObjectIds.length === 0) return;

            event.preventDefault();
            deleteObjects(activeSlideId, selectedObjectIds);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectionTarget, activeSlideId, selectedObjectIds, deleteObjects]);

    if (!activeSlide) {
        return (
            <div className={styles.workspace}>
                <div className={styles.emptyState}>
                    Выберите слайд для редактирования
                </div>
            </div>
        );
    }
    return (
        <div ref={workspaceRef} className={styles.workspace}>
            <SlideView 
                workspaceRef={workspaceRef}
                slide={activeSlide} 
                preview={true}
                className="slideWorkspacePreview"
            />
        </div>
    )
}

export {
    Workspace
}
