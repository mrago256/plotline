import { reactive } from "vue";
import { defineStore } from "pinia";
import { api } from "@/api/api";
import type { ListItem } from "@/const/types";

interface StoreList {
    items: ListItem[];
}

export const useListStore = defineStore("listStore", () => {
    const movieList: StoreList = reactive({ items: [] });
    const showList: StoreList = reactive({ items: [] });

    async function loadMovieList() {
        const data = await api.getMovieList();

        movieList.items.length = 0;
        movieList.items.push(...data);
    }

    async function loadShowList() {
        const data = await api.getShowList();

        showList.items.length = 0;
        showList.items.push(...data);
    }

    async function addToMovieList(movie: ListItem) {
        await api.addToMovieList(movie.tmdbId);
        movieList.items.push(movie);
    }

    async function addToShowList(show: ListItem) {
        await api.addToMovieList(show.tmdbId);
        movieList.items.push(show);
    }

    async function removeFromMovieList(tmdbId: number) {
        const index = movieList.items.findIndex((element) => element.tmdbId == tmdbId);

        api.removeFromMovieList(tmdbId);
        movieList.items.splice(index, 1);
    }

    async function removeFromShowList(tmdbId: number) {
        const index = showList.items.findIndex((element) => element.tmdbId == tmdbId);

        api.removeFromShowList(tmdbId);
        showList.items.splice(index, 1);
    }

    return {
        movieList,
        showList,
        loadMovieList,
        loadShowList,
        removeFromMovieList,
        removeFromShowList,
        addToMovieList,
        addToShowList,
    };
});
