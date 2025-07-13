<script setup lang="ts">
import type { ListItem } from '@/const/types';
import { useListStore } from '@/stores/listStore';
import { computed, watch, type PropType } from 'vue';

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
    isWatched: {
        type: Boolean,
        required: true,
    },
});

const rating = computed(() => {
    return props.rating !== null && props.rating !== undefined ? Math.round(props.rating) : null;
});

const calculateStars = computed(() => {
    if (!rating.value) {
        return 0;
    }

    if (rating.value == 1) {
        return 1;
    }

    return Math.min(5, Math.floor((rating.value + 2) / 3) + 1);
});

const formattedDescription = computed(() => {
    return props.description.length <= 250
        ? props.description
        : props.description.slice(0, 250) + '...';
});

// probably want a confirm modal first, but this works for now
function removeItem() {
    props.type === 'show'
        ? listStore.removeFromShowList(props.tmdbId)
        : listStore.removeFromMovieList(props.tmdbId);
}

function markWatched() {
    console.log('type:', props.type);
    props.type === 'show'
        ? listStore.toggleShowWatched(props.tmdbId)
        : listStore.toggleMovieWatched(props.tmdbId);
}
</script>

<template>
    <div class="card card-border bg-base-100 w-105 shadow-lg">
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
                        <div class="rating rating-xs">
                            <input
                                type="radio"
                                class="mask mask-star-2 bg-amber-300 ratingCursor"
                                disabled="true"
                                :checked="calculateStars === 1"
                            />
                            <input
                                type="radio"
                                class="mask mask-star-2 bg-amber-300 ratingCursor"
                                disabled="true"
                                :checked="calculateStars === 2"
                            />
                            <input
                                type="radio"
                                class="mask mask-star-2 bg-amber-300 ratingCursor"
                                disabled="true"
                                :checked="calculateStars === 3"
                            />
                            <input
                                type="radio"
                                class="mask mask-star-2 bg-amber-300 ratingCursor"
                                disabled="true"
                                :checked="calculateStars === 4"
                            />
                            <input
                                type="radio"
                                class="mask mask-star-2 bg-amber-300 ratingCursor"
                                disabled="true"
                                :checked="calculateStars === 5"
                            />
                        </div>
                        <span class="text-sm text-base-content">{{ rating }}/10</span>
                    </div>
                </div>
                <button class="btn btn-soft btn-error" @click="removeItem">Remove</button>
                <button
                    class="btn ml-auto"
                    :class="props.isWatched ? 'btn-primary' : 'btn-secondary'"
                    @click="markWatched"
                >
                    {{ props.isWatched ? 'Unmark as Watched' : 'Mark Watched' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style>
.ratingCursor {
    cursor: default !important;
}
</style>
