import { ref } from "vue";
import { defineStore } from "pinia";
import { api } from "@/api/api";
import router from "../router";

export const useUserStore = defineStore("userStore", () => {
    const token = ref("");
    const loggedIn = ref(false);
    const loading = ref(false);

    async function attemptLogIn(username: string, password: string) {
        loading.value = true;
        const jwt = await api.logIn(username, password);
        loading.value = false;

        if (jwt.length) {
            loggedIn.value = true;
            token.value = jwt;
            localStorage.setItem("session", JSON.stringify({ token: jwt, timestamp: Date.now() }));

            router.push("/");
        } else {
            // set some sort of error state to show not logged in
            alert("Invalid credentials"); // for now
        }
    }

    return { token, loggedIn, loading, attemptLogIn };
});
