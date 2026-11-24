import styles from "./EditorContainer.module.css"
import { SlideList } from "../../slides/SlideList/SlideList";
import { Workspace } from "../Workspace/Workspace";
import { useEffect, useState } from "react";
import { ContextMenu } from "../../ContextMenu/ContextMenu";
import { removeSlides, removeObjects } from "../../../store/slices/presentationSlice";
import { setSelectedObjects, clearSelection } from "../../../store/slices/viewModelSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

type MenuState =
    | {
        type: "slide";
        slideId: string;
        x: number;
        y: number;
    }
    | {
        type: "object";
        slideId: string;
        objectId: string;
        x: number;
        y: number;
    }
    | null;

function EditorContainer() {
    const dispatch = useAppDispatch();
    const presentation = useAppSelector(state => state.presentation);
    const selectedObjectIds = useAppSelector(state => state.viewModel.selectedObjectIds);
    const selectedSlideIds = useAppSelector(state => state.viewModel.selectedSlideIds);
    const [menuState, setMenuState] = useState<MenuState>(null);

    const isMenuOpen = menuState !== null;

    useEffect(() => {
        const handleClickOutside = () => {
            setMenuState(null);
        };
        if (isMenuOpen) window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, [isMenuOpen]);

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
            <SlideList 
                setMenuState={setMenuState}
            />
            <Workspace 
                setMenuState={setMenuState}
            />
            {menuState !== null && (
                <ContextMenu
                    x={menuState.x}
                    y={menuState.y}
                    onClose={() => setMenuState(null)}
                    onDelete={() => {
                        if (!menuState) return;

                        if (menuState.type === "slide") {
                            const ids = selectedSlideIds.includes(menuState.slideId)
                                ? selectedSlideIds
                                : [menuState.slideId];
                            dispatch(removeSlides({ slideIds: ids }));
                            dispatch(clearSelection());
                        } else {
                            const ids = selectedObjectIds.includes(menuState.objectId)
                                ? selectedObjectIds
                                : [menuState.objectId];
                            dispatch(removeObjects({ slideId: menuState.slideId, objectIds: ids }));
                            dispatch(setSelectedObjects([]));
                        }
                        setMenuState(null);
                    }}
                />
            )}
        </div>
    )
}

export {
    EditorContainer,
    MenuState
}
