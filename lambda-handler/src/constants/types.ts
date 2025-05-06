import { EntryType } from "./enums"

export interface SearchResult {
    name: string,
    year: number | null,
    description: string,
    rating: number,
    posterUrl: string | null,
    type: EntryType,
    popularity: number,
    tmdbId: number
}

export interface QueryResult extends SearchResult {
    bannerUrl: string | null,
}

export interface SavedEntry {
    tmdbId: number,
    name: string,
    year: number | null,
    description: string,
    bannerUrl: string | null,
    posterUrl: string | null,
    type: EntryType,
    rating: number,
    personalRating: number | null,
    popularity: number,
    dateAdded: number,
    dateWatched: number | null,
    watched: boolean
}

