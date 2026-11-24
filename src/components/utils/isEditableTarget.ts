function isEditableTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        return !target.readOnly && !target.disabled;
    }
    return target instanceof HTMLSelectElement;
}

export { isEditableTarget };
