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

<style scoped>
input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 14px;
    width: 14px;
    display: block;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAn0lEQVR42u3UMQrDMBBEUZ9WfQqDmm22EaTyjRMHAlM5K+Y7lb0wnUZPIKHlnutOa+25Z4D++MRBX98MD1V/trSppLKHqj9TTBWKcoUqffbUcbBBEhTjBOV4ja4l4OIAZThEOV6jHO8ARXD+gPPvKMABinGOrnu6gTNUawrcQKNCAQ7QeTxORzle3+sDfjJpPCqhJh7GixZq4rHcc9l5A9qZ+WeBhgEuAAAAAElFTkSuQmCC);
    background-repeat: no-repeat;
    /* icon size */
    background-size: 14px;
}
</style>
