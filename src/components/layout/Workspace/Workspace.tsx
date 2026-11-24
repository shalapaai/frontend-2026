import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useEffect, useRef } from "react";
import { removeObjects } from "../../../store/slices/presentationSlice";
import { setSelectedObjects } from "../../../store/slices/viewModelSlice";
import { isEditableTarget } from "../../utils/isEditableTarget";
import styles from "./Workspace.module.css";
import { SlideView } from "../../slides/SlideView/SlideView";
import { MenuState } from "../EditorContainer/EditorContainer";

type WorkspaceProps = {
    setMenuState: (menu: MenuState) => void,
}

function Workspace(props: WorkspaceProps) {
    const presentation = useAppSelector(state => state.presentation);
    const activeSlideId = useAppSelector(state => state.viewModel.activeSlideId);
    const selectedObjectIds = useAppSelector(state => state.viewModel.selectedObjectIds);
    const selectionTarget = useAppSelector(state => state.viewModel.selectionTarget);
    const dispatch = useAppDispatch();
    const activeSlide = presentation?.slides.find(slide => slide.id === activeSlideId);
    const workspaceRef = useRef<HTMLDivElement>(null);
    const { setMenuState } = props;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Delete" || event.defaultPrevented) return;
            if (isEditableTarget(event.target)) return;
            if (selectionTarget !== "objects" || !activeSlideId || selectedObjectIds.length === 0) return;

            event.preventDefault();
            dispatch(removeObjects({ slideId: activeSlideId, objectIds: selectedObjectIds }));
            dispatch(setSelectedObjects([]));
            setMenuState(null);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectionTarget, activeSlideId, selectedObjectIds, dispatch, setMenuState]);

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
                setMenuState= {props.setMenuState}
            />
        </div>
    )
}

export {
    Workspace
}
