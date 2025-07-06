<script setup lang="ts">
import type { ListItem } from '@/const/types';
import { useListStore } from '@/stores/listStore';
import { computed, type PropType } from 'vue';

const listStore = useListStore();

const props = defineProps({
    tmdbId: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    year: {
        type: [Number, null],
        required: true,
    },
    bannerUrl: {
        type: [String, null],
        required: true,
    },
    rating: {
        type: [Number, null],
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    fullItem: {
        type: Object as PropType<ListItem>,
        required: true,
    },
});

const rating = props.rating ? Math.round(props.rating) : null;

const formattedStars = computed(() => {
    if (!rating) {
        return '☆☆☆☆☆';
    }

    const stars = Math.min(5, Math.floor((rating + 2) / 3) + 1);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
});

const formattedDescription = computed(() => {
    return props.description.length <= 250
        ? props.description
        : props.description.slice(0, 250) + '...';
});

const itemSaved = computed(() => {
    if (props.type === 'show') {
        return !!listStore.showList.items.find((entry) => entry.tmdbId === props.tmdbId);
    } else {
        return !!listStore.movieList.items.find((entry) => entry.tmdbId === props.tmdbId);
    }
});

function addToList() {
    if (props.type === 'show') {
        listStore.addToShowList(props.fullItem);
    } else {
        listStore.addToMovieList(props.fullItem);
    }
}
</script>

<template>
    <div class="temp mx-2">
        <div class="card card-border bg-base-100 w-96 shadow-lg">
            <figure>
                <img v-if="props.bannerUrl" :src="props.bannerUrl" alt="Background Image" />
                <div
                    v-else
                    class="w-full h-54 bg-gray-300 flex items-center justify-center text-gray-500"
                >
                    No Image
                </div>
            </figure>
            <div class="card-body">
                <h2 class="card-title">
                    {{ props.title }}
                    <div class="badge badge-neutral">{{ props.year ?? 'Unknown' }}</div>
                </h2>
                <p>
                    {{ formattedDescription }}
                </p>
                <div class="card-actions flex justify-between items-center">
                    <div class="flex gap-2">
                        <div class="badge badge-outline">
                            {{ props.type === 'show' ? 'Series' : 'Movie' }}
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="text-yellow-400 text-sm">{{ formattedStars }}</div>
                            <span class="text-sm text-base-content">{{ rating }}/10</span>
                        </div>
                    </div>
                    <button class="btn btn-accent" @click="addToList" :disabled="itemSaved">
                        {{ !itemSaved ? 'Add to List' : 'Already Saved' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
