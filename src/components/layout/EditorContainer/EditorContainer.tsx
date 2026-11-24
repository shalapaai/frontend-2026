import styles from "./EditorContainer.module.css"
import { SlideList } from "../../slides/SlideList/SlideList";
import { Workspace } from "../Workspace/Workspace";
import { useEffect } from "react";
import { ContextMenu } from "../../ContextMenu/ContextMenu";
import { clearSelection, closeContextMenu } from "../../../store/slices/viewModelSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useDeleteSelection } from "../../hooks/useDeleteSelection";

function EditorContainer() {
    const dispatch = useAppDispatch();
    const presentation = useAppSelector(state => state.presentation);
    const selectedObjectIds = useAppSelector(state => state.viewModel.selectedObjectIds);
    const selectedSlideIds = useAppSelector(state => state.viewModel.selectedSlideIds);
    const menuState = useAppSelector(state => state.viewModel.contextMenu);
    const { deleteSlides, deleteObjects } = useDeleteSelection();

    const isMenuOpen = menuState !== null;

    useEffect(() => {
        const handleClickOutside = () => {
            dispatch(closeContextMenu());
        };
        if (isMenuOpen) window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, [isMenuOpen, dispatch]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            dispatch(clearSelection());
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [dispatch]);

    if (!presentation) return null;

    return (
        <div 
            className={styles.twoPanelsLayout}
            onClick={event => {
                if (event.defaultPrevented) return;
                if (event.target instanceof Element && event.target.closest("[data-slide-object]")) return;
                dispatch(clearSelection());
            }}
        >
            <SlideList />
            <Workspace />
            {menuState !== null && (
                <ContextMenu
                    x={menuState.x}
                    y={menuState.y}
                    onClose={() => dispatch(closeContextMenu())}
                    onDelete={() => {
                        if (menuState.type === "slide") {
                            const ids = selectedSlideIds.includes(menuState.slideId)
                                ? selectedSlideIds
                                : [menuState.slideId];
                            deleteSlides(ids);
                        } else {
                            const ids = selectedObjectIds.includes(menuState.objectId)
                                ? selectedObjectIds
                                : [menuState.objectId];
                            deleteObjects(menuState.slideId, ids);
                        }
                    }}
                />
            )}
        </div>
    )
}

export {
    EditorContainer
}
