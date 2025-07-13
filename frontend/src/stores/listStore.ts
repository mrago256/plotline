import { ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/api/api';
import type { ListItem } from '@/const/types';

export const useListStore = defineStore('listStore', () => {
    const currentlyDisplayed = ref('shows');
    const listOrder = ref('newest');
    const movieList = ref<ListItem[]>([]);
    const showList = ref<ListItem[]>([]);

    async function loadMovieList() {
        const data = await api.getMovieList();
        movieList.value = [];
        movieList.value.push(...data);
    }

    async function loadShowList() {
        const data = await api.getShowList();
        showList.value = [];
        showList.value.push(...data);
    }

    async function addToMovieList(movie: ListItem) {
        movieList.value.push(movie);
        await api.addToMovieList(movie.tmdbId);
    }

    async function addToShowList(show: ListItem) {
        showList.value.push(show);
        await api.addToShowList(show.tmdbId);
    }

    async function removeFromMovieList(tmdbId: number) {
        movieList.value = movieList.value.filter((item) => item.tmdbId !== tmdbId);
        api.removeFromMovieList(tmdbId);
    }

    async function removeFromShowList(tmdbId: number) {
        showList.value = showList.value.filter((item) => item.tmdbId !== tmdbId);
        api.removeFromShowList(tmdbId);
    }

    async function toggleShowWatched(tmdbId: number) {
        const index = showList.value.findIndex((item) => item.tmdbId === tmdbId);
        const isWatched = showList.value[index].watched;

        showList.value[index].watched = !isWatched;
        api.setShowWatchStatus(tmdbId, !isWatched);
    }

    async function toggleMovieWatched(tmdbId: number) {
        const index = movieList.value.findIndex((item) => item.tmdbId === tmdbId);
        const isWatched = movieList.value[index].watched;

        movieList.value[index].watched = !isWatched;
        api.setMovieWatchStatus(tmdbId, !isWatched);
    }

    return {
        currentlyDisplayed,
        listOrder,
        movieList,
        showList,
        loadMovieList,
        loadShowList,
        removeFromMovieList,
        removeFromShowList,
        addToMovieList,
        addToShowList,
        toggleShowWatched,
        toggleMovieWatched,
    };
});
