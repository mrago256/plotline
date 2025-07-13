import { EntryType } from "../constants/enums";
import { QueryResult, SearchResult } from "../constants/types";

const baseURL = "https://api.themoviedb.org";
const imageURL = "https://image.tmdb.org/t/p";
const multiSearchEndpoint = "/3/search/multi";
const movieDetailsEndpoint = "3/movie";
const showDetailsEndpoint = "3/tv";

const authToken = process.env.TMDB_TOKEN;

// add an endpoint to specifically search movies or tv shows, just filering on frontend will not be gr8
// idk waht that was supposed to mean
export const tmdbAdapter = {
    async searchByName(query: string): Promise<SearchResult[]> {
        const queryUrl = buildSearchUrl(query);
        const response = await performNetworkCall(queryUrl);

        const results = response.results.map((item: any) => mapToSearchResult(item));
        results.sort((a: { popularity: number; language: string }, b: { popularity: number; language: string }) => {
            if (a.language === 'en' && b.language !== 'en') {
                return -1;
            } else if (a.language !== 'en' && b.language === 'en') {
                return 1;
            }

            return b.popularity - a.popularity;
        });

        return results.slice(0, 12);
    },

    async getMovieById(id: number): Promise<QueryResult> {
        const queryUrl = buildMovieIdUrl(id);

        const response = await performNetworkCall(queryUrl);

        // return mapToQueryResult(response);

        // TODO: Fix this temporary jank
        const movie: QueryResult = mapToQueryResult(response);
        movie.type = EntryType.movie;
        return movie;
    },

    async getShowById(id: number): Promise<QueryResult> {
        const queryUrl = buildShowIdUrl(id);

        const response = await performNetworkCall(queryUrl);

        return mapToQueryResult(response);
    }
}

function buildSearchUrl(query: string, page?: number): URL {
    const url = new URL(multiSearchEndpoint, baseURL);
    url.searchParams.append("query", encodeURIComponent(query));
    url.searchParams.append("language", "en-US");
    url.searchParams.append("page", page?.toString() ?? "1");

    return url;
}

function buildMovieIdUrl(id: number): URL {
    const url = new URL(`${movieDetailsEndpoint}/${id}`, baseURL);
    url.searchParams.append("language", "en-US");

    return url;
}

function buildShowIdUrl(id: number): URL {
    const url = new URL(`${showDetailsEndpoint}/${id}`, baseURL);
    url.searchParams.append("language", "en-US");

    return url;
}

function mapToSearchResult(item: any): SearchResult {
    const posterUrl = item.poster_path ? `${imageURL}/w500${item.poster_path}` : null;
    const bannerUrl = item.backdrop_path ? `${imageURL}/original${item.backdrop_path}` : null;
    const yearString = item.release_date || item.first_air_date;

    return {
        name: item.name || item.title,
        year: yearString ? new Date(yearString).getFullYear() : null,
        description: item.overview || "No description available",
        rating: item.vote_average,
        bannerUrl: bannerUrl,
        posterUrl: posterUrl,
        type: item.media_type === "movie" ? EntryType.movie : EntryType.show,
        popularity: item.popularity,
        language: item.original_language,
        tmdbId: item.id
    }
}

// TODO: Remove useless QueryResult type
function mapToQueryResult(item: any): QueryResult {
    return mapToSearchResult(item) as QueryResult;
}

async function performNetworkCall(url: URL, body?: any): Promise<any> {
    const response = await fetch(url, {
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${authToken}`
        },
        body: body
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Unknown network error - ${response.status}\n${errorBody}`);
    }

    const json = await response.json();
    return json
}
