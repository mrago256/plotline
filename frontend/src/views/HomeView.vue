<script setup lang="ts">
import { api } from "@/api/api";
import { useListStore } from "@/stores/listStore";
import LogOut from "@/components/LogOut.vue";
import Search from "@/components/Search.vue";

const listStore = useListStore();

async function imCool() {
    const list = await api.getShowList();
    console.log("List:", list);
}
</script>

<template>
    <LogOut class="mx-2" />
    <button class="btn btn-primary mx-2" :onclick="imCool">yoyoyo cool</button>
    <button class="btn btn-secondary mx-2" :onclick="listStore.loadShowList">Click meeeee</button>
    <Search class="mx-2" />
    <p>Items: {{ listStore.showList }}</p>
</template>
