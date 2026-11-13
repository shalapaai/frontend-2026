export type History<T> = {
    past: T[];
    present: T;
    future: T[];
};

function recordHistory<T>(history: History<T>, next: T, limit = 50): History<T> {
    if (Object.is(history.present, next)) return history;
    return {
        past: [...history.past, history.present].slice(-limit),
        present: next,
        future: [],
    };
}

function undoHistory<T>(history: History<T>): History<T> {
    if (!history.past.length) return history;
    return {
        past: history.past.slice(0, -1),
        present: history.past[history.past.length - 1],
        future: [history.present, ...history.future],
    };
}

function redoHistory<T>(history: History<T>): History<T> {
    if (!history.future.length) return history;
    return {
        past: [...history.past, history.present],
        present: history.future[0],
        future: history.future.slice(1),
    };
}

export {
    recordHistory,
    undoHistory,
    redoHistory
}