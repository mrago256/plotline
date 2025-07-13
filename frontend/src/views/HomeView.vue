<script setup lang="ts">
import { useListStore } from '@/stores/listStore';
import ListResult from '@/components/ListResult.vue';
import { computed } from 'vue';

const listStore = useListStore();

const dispalySelected = computed(() => {
    return listStore.currentlyDisplayed === 'shows' ? 'Shows' : 'Movies';
});

const filteredList = computed(() => {
    const list =
        listStore.currentlyDisplayed === 'shows' ? listStore.showList : listStore.movieList;

    if (listStore.listOrder === 'newest') {
        list.sort((a: { dateAdded: number }, b: { dateAdded: number }) => {
            // hacky fix for now since newly added items don't have the dateAdded parameter. Yet another reason
            // I should just do a reload from api
            if (!a.dateAdded && b.dateAdded) {
                return -1;
            }

            if (!b.dateAdded && a.dateAdded) {
                return 1;
            }

            return b.dateAdded - a.dateAdded;
        });
    } else if (listStore.listOrder === 'rated') {
        list.sort((a: { rating: number }, b: { rating: number }) => {
            return b.rating - a.rating;
        });
    }

    return listStore.currentlyDisplayed === 'shows' ? listStore.showList : listStore.movieList;
});

function showShows() {
    listStore.currentlyDisplayed = 'shows';
}

function showMovies() {
    listStore.currentlyDisplayed = 'movies';
}

function toggleSort() {
    listStore.listOrder = listStore.listOrder === 'newest' ? 'rated' : 'newest';
}
</script>

<template>
    <div class="m-5">
        <div class="dropdown dropdown-hover">
            <div tabindex="0" role="button" class="btn mr-2">{{ dispalySelected }}</div>
            <ul
                tabindex="0"
                class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
                <li @click="showShows">
                    <a :class="listStore.currentlyDisplayed === 'shows' ? 'bg-base-200' : ''"
                        >Shows</a
                    >
                </li>
                <li @click="showMovies">
                    <a :class="listStore.currentlyDisplayed === 'movies' ? 'bg-base-200' : ''"
                        >Movies</a
                    >
                </li>
            </ul>
        </div>
        <button class="btn btn-secondary mx-2" @click="toggleSort">
            {{ listStore.listOrder === 'newest' ? 'Recently Added' : 'Rating' }}
        </button>
        <div class="divider"></div>
        <div class="flex flex-wrap gap-4">
            <ListResult
                v-for="entry in filteredList"
                class="flex flex-grow justify-center"
                :tmdb-id="entry.tmdbId"
                :title="entry.name"
                :description="entry.description"
                :year="entry.year"
                :banner-url="entry.bannerUrl"
                :rating="entry.rating"
                :type="entry.type"
                :is-watched="entry.watched"
            />
        </div>
    </div>
</template>
