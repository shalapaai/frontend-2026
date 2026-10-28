import { describe, expect, it } from "vitest";
import { recordHistory, undoHistory, redoHistory } from "../functions/history";
import type { History } from "../functions/history";

const initial = (): History<number> => ({ past: [], present: 0, future: [], revision: 0 });

describe("presentation history", () => {
    it("restores multiple edits in both directions", () => {
        const edited = recordHistory(recordHistory(initial(), 1), 2);
        const once = undoHistory(edited);
        expect(once.present).toBe(1);
        const twice = undoHistory(once);
        expect(twice.present).toBe(0);
        expect(redoHistory(redoHistory(twice)).present).toBe(2);
        expect(edited.present).toBe(2);
    });

    it("clears redo after a new edit", () => {
        const undone = undoHistory(recordHistory(initial(), 1));
        const edited = recordHistory(undone, 3);
        expect(edited.future).toEqual([]);
        expect(redoHistory(edited)).toBe(edited);
        expect(undoHistory(edited).present).toBe(0);
    });

    it("does nothing at history boundaries or for unchanged values", () => {
        const state = initial();
        expect(undoHistory(state)).toBe(state);
        expect(redoHistory(state)).toBe(state);
        expect(recordHistory(state, 0)).toBe(state);
    });

    it("limits undo history to 50 steps", () => {
        let state = initial();
        for (let i = 1; i <= 60; i++) state = recordHistory(state, i);
        expect(state.past).toHaveLength(50);
        for (let i = 0; i < 50; i++) state = undoHistory(state);
        expect(state.present).toBe(10);
        expect(undoHistory(state)).toBe(state);
        for (let i = 0; i < 50; i++) state = redoHistory(state);
        expect(state.present).toBe(60);
        expect(state.past).toHaveLength(50);
    });
});
