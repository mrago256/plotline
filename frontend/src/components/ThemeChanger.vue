<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
// secret window

const light = 'emerald';
const dark = 'dracula';

const isDark = ref(false);

onMounted(() => {
    loadTheme();
});

watch(isDark, (newValue) => {
    localStorage.setItem('theme', JSON.stringify(newValue));
    updateTheme();
});

function loadTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        isDark.value = storedTheme == 'true';
    }

    updateTheme();
}

function updateTheme() {
    document.documentElement.setAttribute('data-theme', isDark.value ? dark : light);
}
</script>

<template>
    <label class="toggle text-base-content">
        <input type="checkbox" name="themeSwitcher" :checked="isDark" @change="isDark = !isDark" />

        <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2"
                fill="none"
                stroke="currentColor"
            >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
            </g>
        </svg>

        <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2"
                fill="none"
                stroke="currentColor"
            >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </g>
        </svg>
    </label>
</template>
