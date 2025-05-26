<script setup lang="ts">
import { api } from "@/api/api";
import type { ListItem } from "@/const/types";
import { debounce } from "@/util/debounce";
import { reactive, ref } from "vue";

const searchQuery = ref("");
const searchItems: ListItem[] = reactive([]);

const debouncedSearch = debounce(search, 1000);

async function search() {
    searchItems.length = 0;

    if (searchQuery.value.length == 0) {
        return;
    }

    try {
        const items = await api.searchByName(searchQuery.value);
        searchItems.push(...items);
    } catch (error) {
        console.error("Some error happened"); // for now
    }
}
</script>

<template>
    <div>
        <input class="input" placeholder="Search" @input="debouncedSearch" v-model="searchQuery" />
        <div>
            {{ searchItems.map((searchItem) => searchItem.name) }}
        </div>
    </div>
</template>
