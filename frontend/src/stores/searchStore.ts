import { api } from "@/api/api";
import type { StoreList } from "@/const/types";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import router from "../router";

export const useSearchStore = defineStore("searchStore", () => {
    const loading = ref(false);
    const searchList: StoreList = reactive({ items: [] });

    async function search(searchQuery: string) {
        loading.value = true;

        if (!searchQuery.length) {
            searchList.items.length = 0;
            loading.value = false;
            router.push("/");
            return;
        }

        let data;
        try {
            data = await api.searchByName(searchQuery);
            searchList.items.length = 0;
            searchList.items.push(...data);
        } catch (error) {
            console.error("Error searching", error); // for now
        } finally {
            loading.value = false;
        }

        router.push("/search");
    }

    return {loading, searchList, search};
});
