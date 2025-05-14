import { EntryType } from "../constants/enums";
import { QueryResult, SearchResult } from "../constants/types";

const baseURL = "https://api.themoviedb.org";
const imageURL = "https://image.tmdb.org/t/p";
const multiSearchEndpoint = "/3/search/multi";
const movieDetailsEndpoint = "3/movie";
const showDetailsEndpoint = "3/tv";

const authToken = process.env.TMDB_TOKEN;

export const tmdbAdapter = {
    async searchByName(query: string): Promise<SearchResult[]> {
        const queryUrl = buildSearchUrl(query);
        const response = await performNetworkCall(queryUrl);

        const results = response.results.map((item: any) => mapToSearchResult(item));
        results.sort((a: { popularity: number; }, b: { popularity: number; }) => b.popularity - a.popularity);

        return results.slice(0, 8);
    },

    async getMovieById(id: number): Promise<QueryResult> {
        const queryUrl = buildMovieIdUrl(id);

        const response = await performNetworkCall(queryUrl);

        return mapToQueryResult(response);
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
    const yearString = item.release_date || item.first_air_date;

    return {
        name: item.name || item.title,
        year: yearString ? new Date(yearString).getFullYear() : null,
        description: item.overview || "No description available",
        rating: item.vote_average,
        posterUrl: posterUrl,
        type: item.media_type == "movie" ? EntryType.movie : EntryType.show,
        popularity: item.popularity,
        tmdbId: item.id
    }
}

function mapToQueryResult(item: any): QueryResult {
    const queryResult = mapToSearchResult(item) as QueryResult;
    const bannerUrl = item.backdrop_path ? `${imageURL}/original${item.backdrop_path}` : null;

    queryResult.bannerUrl = bannerUrl;

    return queryResult;
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
