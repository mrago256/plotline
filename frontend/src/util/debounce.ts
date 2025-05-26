export function debounce(callback: () => void, delay: number): () => void {
    let timer: number | undefined;

    return () => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(), delay);
    };
}
