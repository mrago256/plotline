import type { ListItem } from '@/const/types';
import { useUserStore } from '@/stores/userStore';

export const api = {
    async logIn(username: string, password: string): Promise<string> {
        const body = {
            username: username,
            password: password,
        };

        try {
            const response = await makeRequest('/logIn', body);
            return (response as { token: string }).token;
        } catch (error) {
            return '';
        }
    },

    async searchByName(query: string): Promise<ListItem[]> {
        const body = {
            searchQuery: query,
        };

        const response = await makeRequest('/searchByName', body);
        return response as ListItem[];
    },

    async getMovieList(): Promise<ListItem[]> {
        const response = await makeRequest('/getAllMovies');
        return response as ListItem[];
    },

    async getShowList(): Promise<ListItem[]> {
        const response = await makeRequest('/getAllShows');
        return response as ListItem[];
    },

    async addToMovieList(tmdbId: number): Promise<void> {
        const body = {
            tmdbId: tmdbId,
        };
        await makeRequest('/addMovie', body);
    },

    async addToShowList(tmdbId: number): Promise<void> {
        const body = {
            tmdbId: tmdbId,
        };
        await makeRequest('/addShow', body);
    },

    async removeFromMovieList(tmdbId: number): Promise<void> {
        const body = {
            tmdbId: tmdbId,
        };
        await makeRequest('/removeMovie', body);
    },

    async removeFromShowList(tmdbId: number): Promise<void> {
        const body = {
            tmdbId: tmdbId,
        };
        await makeRequest('/removeShow', body);
    },
};

async function makeRequest(endpoint: string, body: Record<string, unknown> = {}): Promise<unknown> {
    const userStore = useUserStore();
    const prefix = '';

    const response = await fetch(prefix + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: userStore.token,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Backend error occurred - ${response.status}\n${errorBody}`);
    }

    const json = await response.json();
    return json.data;
}
