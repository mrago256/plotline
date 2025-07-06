<script setup lang="ts">
import { useListStore } from "@/stores/listStore";
import { ref } from "vue";

const listStore = useListStore();
const testRender = ref(false);

async function imCool() {
    testRender.value = !testRender.value;
}
</script>

<template>
    <button class="btn btn-secondary mx-2" :onclick="listStore.loadShowList">Load Show List</button>
    <button class="btn btn-primary mx-2" :onclick="imCool">Toggle List</button>
    <p v-if="testRender">Items: {{ listStore.showList.items }}</p>
</template>
