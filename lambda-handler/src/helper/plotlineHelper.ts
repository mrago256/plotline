import { dynamoDBAdpater } from "../adapter/dynamoDBAdapter";
import { tmdbAdapter } from "../adapter/tmdbAdapter";
import { EntryType } from "../constants/enums";
import { SavedEntry, SearchResult } from "../constants/types";

export const plotlineHelper = {
    async getAllSavedMovies(): Promise<SavedEntry[]> {
        return await dynamoDBAdpater.getSavedList(EntryType.movie);
    },

    async getAllSavedShows(): Promise<SavedEntry[]> {
        return await dynamoDBAdpater.getSavedList(EntryType.show);
    },

    async queryByName(query: string): Promise<SearchResult[]> {
        return await tmdbAdapter.searchByName(query);
    },

    async addMovieToList(tmdbId: number): Promise<void> {
        const movieToAdd = await tmdbAdapter.getMovieById(tmdbId);
        await dynamoDBAdpater.saveNewMovie(movieToAdd);
    },

    async addShowToList(tmdbId: number): Promise<void> {
        const showToAdd = await tmdbAdapter.getShowById(tmdbId);
        await dynamoDBAdpater.saveNewShow(showToAdd);
    },

    async setMovieWatchStatus(tmdbId: number, status: boolean): Promise<void> {
        await dynamoDBAdpater.updateWatchedMovie(tmdbId, status);
    },

    async setShowWatchStatus(tmdbId: number, status: boolean): Promise<void> {
        await dynamoDBAdpater.updateWatchedShow(tmdbId, status);
    },

    async setMoviePersonalRating(tmdbId: number, rating: number): Promise<void> {
        if (rating < 0 || rating > 10) {
            throw new Error(`Invalid rating: ${rating}. Must be in range 0-10`);
        }

        await dynamoDBAdpater.updateMovieRating(tmdbId, rating);
    },

    async setShowPersonalRating(tmdbId: number, rating: number): Promise<void> {
        if (rating < 0 || rating > 10) {
            throw new Error(`Invalid rating: ${rating}. Must be in range 0-10`);
        }

        await dynamoDBAdpater.updateShowRating(tmdbId, rating);
    },

    async removeMovieFromList(tmdbId: number): Promise<void> {
        await dynamoDBAdpater.deleteMovie(tmdbId);
    },

    async removeShowFromList(tmdbId: number): Promise<void> {
        await dynamoDBAdpater.deleteShow(tmdbId);
    },

    validateInput(input: Record<string, any>, requiredFields: string[]): string | null {
        if (!input) {
            return "Input must not be null";
        }
        
        for (const field of requiredFields) {
            if (!input[field]) {
                return `Field: ${field} is missing from input`;
            }
        }

        return null;
    }
}
