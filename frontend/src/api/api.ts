export const api = {
    async logIn(username: string, password: string): Promise<boolean> {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return true;
    },
};
