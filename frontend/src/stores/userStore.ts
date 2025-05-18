import { ref } from "vue";
import { defineStore } from "pinia";
import { api } from "@/api/api";
import router from "../router";

export const useUserStore = defineStore("userStore", () => {
    const loggedIn = ref(false);
    const loading = ref(false);

    async function attemptLogIn(username: string, password: string) {
        loading.value = true;
        const response = await api.logIn(username, password);
        loading.value = false;

        if (response) {
            loggedIn.value = true;
            localStorage.setItem("session", JSON.stringify({ timestamp: Date.now() }));

            router.push("/");
        }
    }

    return { loggedIn, loading, attemptLogIn };
});
