<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { ref } from "vue";

const userStore = useUserStore();

const username = ref("");
const password = ref("");

async function login() {
    userStore.attemptLogIn(username.value, password.value);
}
</script>

<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <img class="mx-auto h-10 w-auto" src="../assets/icon.svg" alt="Plotline" /> <!-- Placeholder icon -->
        <h2 class="mt-10 text-center text-2xl/9 font-bold">Plotline</h2>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="login">
                <div>
                    <label class="floating-label">
                        <span>Username</span>
                        <input
                            class="input input-md w-full text-base"
                            type="username"
                            name="username"
                            autocomplete="username"
                            required="true"
                            placeholder="Username"
                            v-model="username"
                        />
                    </label>
                </div>

                <div>
                    <label class="floating-label">
                        <span>Password</span>
                        <input
                            class="input input-md w-full text-base"
                            type="password"
                            name="password"
                            autocomplete="current-password"
                            required="true"
                            placeholder="Password"
                            v-model="password"
                        />
                    </label>
                </div>

                <div>
                    <button type="submit" class="btn btn-primary w-full">
                        <span v-if="userStore.loading" class="loading loading-spinner"></span>
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
