<script setup>
const { pending: coursesDataPending, data: coursesData } = await useLazyFetch("/api/content/get-all-courses-for-catalog");
</script>

<template>
    <div class="con mt-8">
        <h1 class="text-4xl font-bold mb-8">Katalog Kursus</h1>
        <div v-if="coursesDataPending">
            <span class="loading loading-bars loading-md"></span>
        </div>
        <div v-else class="grid grid-cols-3 gap-4 min-h-screen">
            <template v-for="course in coursesData" :key="course._id">
                <NuxtLink :to="`/${course.slug.current}`">
                    <div class="card card-compact bg-slate-900 hover:bg-slate-800 shadow-xl">
                        <figure><img :src="course.mainImage" alt="Shoes" class="w-full h-56 bg-cover" /></figure>
                        <div class="card-body">
                            <h2 class="card-title">{{ course.title }}</h2>
                            <p class="text-lg">{{ course.shortDescription }}</p>
                        </div>
                    </div>
                </NuxtLink>
            </template>
        </div>
    </div>
</template>

<style>

</style>