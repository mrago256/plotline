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

const rating = computed(() => {
    return props.rating ? Math.round(props.rating) : null;
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

const itemSaved = computed(() => {
    if (props.type === 'show') {
        return !!listStore.showList.find((entry) => entry.tmdbId === props.tmdbId);
    } else {
        return !!listStore.movieList.find((entry) => entry.tmdbId === props.tmdbId);
    }
});

function handleSave() {
    if (props.type === 'show') {
        itemSaved.value
            ? listStore.removeFromShowList(props.tmdbId)
            : listStore.addToShowList(props.fullItem);
    } else {
        itemSaved.value
            ? listStore.removeFromMovieList(props.tmdbId)
            : listStore.addToMovieList(props.fullItem);
    }
}
</script>

<template>
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
                <button
                    class="btn btn-accent"
                    :class="!itemSaved ? 'btn-accent' : 'btn-soft btn-error'"
                    @click="handleSave"
                >
                    {{ !itemSaved ? 'Add to List' : 'Remove' }}
                </button>
            </div>
        </div>
    </div>
</template>
