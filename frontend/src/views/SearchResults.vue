<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore';
import SearchResult from '@/components/SearchResult.vue';

const searchStore = useSearchStore();
</script>

<template>
    <div class="flex flex-wrap gap-4 py-2">
        <SearchResult
            v-for="entry in searchStore.searchList.items"
            class="flex-grow flex justify-center"
            :tmdb-id="entry.tmdbId"
            :title="entry.name"
            :description="entry.description"
            :year="entry.year"
            :banner-url="entry.bannerUrl"
            :rating="entry.rating"
            :type="entry.type"
            :full-item="entry"
        />
    </div>
</template>
