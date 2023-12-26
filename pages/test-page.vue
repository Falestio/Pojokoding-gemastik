<script setup>
import { logEvent } from 'firebase/analytics';

const { $analytics } = useNuxtApp()

const numbers = ref([1,2,3,4])

const handleAnalytics = (number) => {
    console.log("Clicked: ", number)

    logEvent($analytics, 'test_event', {
        number: number
    })
}
</script>

<template>
    <div class="p-8">
        <div v-for="number in numbers" :key="number" class="flex gap-4">
            <button @click="handleAnalytics(number)" class="btn btn-primary">{{number}}</button>
        </div>
    </div>
</template>
  
