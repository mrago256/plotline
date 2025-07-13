export interface ListItem {
    tmdbId: number;
    name: string;
    year: number | null;
    description: string;
    bannerUrl: string | null;
    posterUrl: string | null;
    type: 'show' | 'movie';
    rating: number;
    personalRating: number | null;
    popularity: number;
    dateAdded: number;
    dateWatched: number | null;
    watched: boolean;
}
