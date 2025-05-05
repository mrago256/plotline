import { EntryType } from "./enums"

export interface SearchResult {
    name: string,
    year: number,
    description: string,
    rating: number,
    posterUrl: string,
    type: EntryType,
    popularity: number,
    id: number
}

export interface QueryResult extends SearchResult {
    bannerUrl: string,
    // other stuff l8r probably
}

export interface SavedEntry {
    id: number,
    name: string,
    year: number,
    description: string,
    bannerUrl: string,
    posterUrl: string,
    type: EntryType,
    rating: number,
    personalRating: number | null,
    popularity: number,
    watched: boolean
}

