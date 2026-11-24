import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectSlide as selectSlideAction } from "../../store/slices/viewModelSlice";

function useSlideSelection() {
    const dispatch = useAppDispatch();
    const activeSlideId = useAppSelector(state => state.viewModel.activeSlideId);
    const selectedSlideIds = useAppSelector(state => state.viewModel.selectedSlideIds);

    const selectSlide = useCallback((slideId: string, additive = false) => {
        dispatch(selectSlideAction({ slideId, additive }));
    }, [dispatch]);

    return { activeSlideId, selectedSlideIds, selectSlide };
}

export { useSlideSelection };
