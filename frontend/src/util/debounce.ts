export function debounce(
    callback: () => void,
    delay: number,
): { debounced: () => void; cancelDebounced: () => void } {
    let timer: number | undefined;

    const debounced = () => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(), delay);
    };

    const cancelDebounced = () => {
        clearTimeout(timer);
    };

    return { debounced, cancelDebounced };
}
