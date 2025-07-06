<script setup lang="ts">
import { onBeforeMount } from "vue";
import NavBar from "./components/NavBar.vue";
import { useUserStore } from "./stores/userStore";
import { useListStore } from "./stores/listStore";

onBeforeMount(() => {
    handleSession();
    loadLists();
});

function handleSession() {
    const userStore = useUserStore();

    const session = localStorage.getItem("session");
    const sessionInfo = session ? JSON.parse(session) : null;

    const validDate = new Date();
    validDate.setHours(validDate.getHours() - 1);

    if (sessionInfo && !(sessionInfo.timestamp < validDate)) {
        userStore.loggedIn = true;
        userStore.token = sessionInfo.token;
        return;
    }

    userStore.loggedIn = false;
    localStorage.removeItem("session");
}

function loadLists() {
    const listStore = useListStore();
    listStore.loadMovieList();
    listStore.loadShowList();
}

</script>

<template>
    <header>
        <NavBar class="mb-4"/>
    </header>

    <RouterView />
</template>
