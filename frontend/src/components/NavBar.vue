<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import LogOut from './LogOut.vue';
import Search from './Search.vue';
import ThemeChanger from './ThemeChanger.vue';

const userStore = useUserStore();
</script>

<template>
    <nav class="navbar bg-base-100 shadow w-full">
        <div class="flex-1">
            <RouterLink to="/" class="btn btn-ghost text-xl mr-12">Plotline</RouterLink>
            <Search v-if="userStore.loggedIn" />
        </div>
        <div class="flex gap-4 items-center">
            <ThemeChanger />
            <LogOut v-if="userStore.loggedIn" />
        </div>
    </nav>
</template>
