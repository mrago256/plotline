<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import ThemeChanger from "./components/ThemeChanger.vue";
</script>

<template>
    <header>
        <div class="wrapper m-2">
            <ThemeChanger />
            <HelloWorld msg="You did it!" />
            <nav>
                <RouterLink to="/">Home</RouterLink>
            </nav>
        </div>
    </header>

    <RouterView />
</template>
