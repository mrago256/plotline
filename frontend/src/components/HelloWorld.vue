<script setup lang="ts">
import { computed, ref } from "vue";

const testRef = ref(false);

const test = computed(() => {
    if (testRef.value) {
        return "btn-primary";
    }

    return "btn-accent";
});

function toggleButton() {
    testRef.value = !testRef.value;
}
</script>

<template>
    <div class="greetings">
        <button :class="['btn w-50 my-1', test]" :onclick="toggleButton">{{ testRef }}</button>
        <h3>This is Plotline</h3>
    </div>
</template>
