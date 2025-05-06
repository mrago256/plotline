import { getSavedList, saveMovie, saveShow } from "../adapter/dynamoDBAdapter";
import { getMovieById, getShowById, searchByName } from "../adapter/tmdbAdapter";
import { EntryType } from "../constants/enums";

// these inputs are probably wrong, i just should pass the body with it, and extract it within each method
// also add return types
export async function getAllSavedMovies() {
    // no input
    return await getSavedList(EntryType.movie);
}

export async function getAllSavedShows() {
    // no input
    return await getSavedList(EntryType.show);
}

export async function queryByName(query: string) {
    return await searchByName(query);
}

export async function addMovieToList(tmdbId: number) {
    // input - id number

    const movieToAdd = await getMovieById(tmdbId);
    await saveMovie(movieToAdd);
}

export async function addShowToList(tmdbId: number) {
    // input - id number

    const showToAdd = await getShowById(tmdbId);
    await saveShow(showToAdd);
}

export async function setWatched() {

}

export async function setNotWatched() {

}

export async function setPersonalRating() {

}

export async function removeFromList() {

}
