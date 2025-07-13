<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore';
import { debounce } from '@/util/debounce';
import { ref } from 'vue';

const searchQuery = ref('');
const searchStore = useSearchStore();
const { debounced: debouncedSearch, cancelDebounced } = debounce(search, 750);

function handleInput() {
    if (searchQuery.value.length) {
        debouncedSearch();
    } else {
        search();
    }
}

function handleEnter() {
    cancelDebounced();
    search();
}

function search() {
    searchStore.search(searchQuery.value);
}
</script>

<template>
    <label class="input w-100 focus-within:border-none">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2.5"
                fill="none"
                stroke="currentColor"
            >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
            </g>
        </svg>
        <input
            class="text-base md:text-sm lg:text-sm"
            type="search"
            placeholder="Search"
            @input="handleInput"
            @keydown.enter="handleEnter"
            v-model="searchQuery"
        />
        <span v-if="searchStore.loading" class="loading loading-spinner text-accent"></span>
    </label>
</template>
