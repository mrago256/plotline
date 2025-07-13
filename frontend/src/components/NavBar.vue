<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import LogOut from './LogOut.vue';
import Search from './Search.vue';
import ThemeChanger from './ThemeChanger.vue';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();

const isLargeScreen = ref(false);

const checkScreenSize = () => {
    isLargeScreen.value = window.innerWidth >= 768;
};

onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
});
</script>

<template>
    <nav v-if="isLargeScreen" class="navbar bg-base-100 shadow w-full">
        <div class="flex-1">
            <RouterLink to="/" class="btn btn-ghost text-xl mr-12">Plotline</RouterLink>
            <Search v-if="userStore.loggedIn" />
        </div>
        <div class="flex gap-4 items-center">
            <ThemeChanger />
            <LogOut v-if="userStore.loggedIn" />
        </div>
    </nav>

    <nav v-else class="navbar bg-base-100 shadow w-full">
        <div class="flex flex-col flex-grow space-y-4">
            <div class="flex justify-between items-center w-full">
                <RouterLink to="/" class="btn btn-ghost text-xl">Plotline</RouterLink>
                <div class="flex items-center space-x-4">
                    <ThemeChanger />
                    <LogOut v-if="userStore.loggedIn" />
                </div>
            </div>
            <Search v-if="userStore.loggedIn" class="w-full" />
        </div>
    </nav>
</template>
