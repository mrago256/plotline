<script setup lang="ts">
import router from '@/router';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

function logOut() {
    localStorage.removeItem('session');
    userStore.loggedIn = false;
    router.push('/logIn');
}
</script>

<template>
    <button class="btn btn-accent btn-soft" :onclick="logOut">Log Out</button>
</template>
