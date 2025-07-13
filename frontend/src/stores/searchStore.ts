import { api } from '@/api/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import router from '../router';
import type { ListItem } from '@/const/types';

export const useSearchStore = defineStore('searchStore', () => {
    const loading = ref(false);
    const searchList = ref<ListItem[]>([]);

    async function search(searchQuery: string) {
        loading.value = true;

        if (!searchQuery.length) {
            searchList.value = [];
            loading.value = false;
            router.push('/');
            return;
        }

        let data;
        try {
            data = await api.searchByName(searchQuery);
            searchList.value = [];
            searchList.value.push(...data);
        } catch (error) {
            console.error('Error searching', error); // for now
        } finally {
            loading.value = false;
        }

        router.push('/search');
    }

    return { loading, searchList, search };
});
