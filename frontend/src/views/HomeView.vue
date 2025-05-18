<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();

function logOut() {
    localStorage.removeItem("session");
    userStore.loggedIn = false;
    router.push("/signIn");
}
</script>

<template>
    <button class="btn btn-primary mx-2" :onclick="logOut">Log Out</button>
</template>
