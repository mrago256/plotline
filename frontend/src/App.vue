<script setup lang="ts">
import { onBeforeMount } from "vue";
import { RouterLink, RouterView } from "vue-router";
import ThemeChanger from "./components/ThemeChanger.vue";
import { useUserStore } from "./stores/userStore";

onBeforeMount(() => {
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
});
</script>

<template>
    <header>
        <div class="wrapper m-2">
            <ThemeChanger />
            <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/login" class="mx-2">test Login</RouterLink>
            </nav>
        </div>
    </header>

    <RouterView />
</template>
