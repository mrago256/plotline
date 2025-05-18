<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import ThemeChanger from "./components/ThemeChanger.vue";
import { onBeforeMount } from "vue";
import { useUserStore } from "./stores/userStore";

onBeforeMount(() => {
    const userStore = useUserStore();

    const session = localStorage.getItem("session");
    console.log("session", session);
    const sessionInfo = session ? JSON.parse(session) : null;

    let validDate = new Date();
    validDate.setHours(validDate.getHours() - 2);

    if (sessionInfo && !(sessionInfo.timestamp < validDate)) {
        userStore.loggedIn = true;
        localStorage.setItem("session", JSON.stringify({ timestamp: Date.now() }));
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
            <HelloWorld msg="You did it!" />
            <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/login" class="mx-2">test Login</RouterLink>
            </nav>
        </div>
    </header>

    <RouterView />
</template>
