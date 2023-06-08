<script setup>
import { getOneCourse } from "@/utils/content/getOneCourse";
import { readAllReview } from "@/utils/course-review/readAllReview";

const route = useRoute();
const courseSlug = route.params.course;
const courseData = await getOneCourse(courseSlug);

console.log(courseData.value._id);
const allReviewInCourse = ref(null);

async function handleGetAllReview() {
    allReviewInCourse.value = await readAllReview(courseData.value._id);
}

// TODO: Revise data displaying
// TODO: make sub course
// TODO: improve UI
</script>

<template>
    <div class="mt-8">
        <div class="bg-[#191825] px-[80px] text-white">
            <main class="flex w-7/12 flex-col gap-6">
                <div class="flex flex-col">
                    <h2 class="text-5xl font-medium">{{ courseData.title }}</h2>
                    <p>{{ courseData.shortDescription }}</p>
                </div>
                <div>
                    <h2 class="text-2xl">Yang akan dipelajari</h2>
                    <p>{{ courseData.learningObjectives }}</p>
                </div>
                <div class="flex flex-col gap-2">
                    <h2 class="text-2xl">Materi Kursus</h2>
                    <p>27 sections • 165 lectures • 24h 54m total length</p>

                    <ul class="space-y-4">
                        <template v-for="(content, index) in courseData.content" :key="index">
                            <NuxtLink class="flex flex-col gap-2" :to="`/${courseData.slug.current}/${content.slug.current}`">
                                <div class="p-2 rounded-lg bg-slate-700 hover:bg-slate-800">
                                    <h3 class="text-lg font-semibold text-white">{{ content.title }}</h3>
                                </div>
                            </NuxtLink>
                        </template>
                    </ul>
                </div>
                <div class="flex flex-col gap-2">
                    <h2 class="text-2xl">Deskripsi</h2>
                    <div class="flex flex-col gap-3">
                        {{ courseData.description }}
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <h2 class="text-2xl">Review</h2>
                    <button v-if="!allReviewInCourse" @click="handleGetAllReview()" class="btn">Tampilkan Review</button>
                    <div v-for="review in allReviewInCourse" :key="review.id" class="flex flex-col space-y-2 p-4 bg-slate-800 shadow rounded-md mb-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <img :src="review.photoUrl" alt="User avatar" class="w-8 h-8 rounded-full" />
                                <div>
                                    <p class="text-sm font-bold">{{ review.username }}</p>
                                    <div class="flex space-x-1">
                                        <span v-for="star in review.rating" :key="star" class="text-yellow-500"> ★ </span>
                                    </div>
                                </div>
                            </div>
                            <p class="text-xs text-gray-500">{{ new Date(review.createdAt.seconds * 1000).toLocaleDateString() }}</p>
                        </div>
                        <p class="text-sm">{{ review.content }}</p>
                    </div>
                </div>
            </main>
            <div class="absolute w-4/12 border border-second top-32 right-24">
                <img :src="courseData.image" alt="gambar" class="bg-slate-400 h-64 w-full" />
                <div class="px-4 text-xl py-2">
                    <p>Rp {{ courseData.price }}</p>
                    <div class="flex h-10 gap-3 mt-3">
                        <NuxtLink :to="`/${courseData.slug.current}/${courseData.content[0].slug.current}`" class="w-full bg-primary flex items-center justify-center text-background">Mulai Belajar</NuxtLink>
                        <button type="button" class="w-3/12 border border-second">Beli</button>
                    </div>
                </div>
            </div>

            <div class="bg-second h-[1px] mx-24 mt-16"></div>
            <footer class="flex justify-between items-center px-[80px] pt-8 pb-8 text-white">
                <h1 class="text-3xl font-bold text-primary drop-shadow-md">PojoKoding</h1>
                <p>PojoKoding Copyright 2023</p>
            </footer>
        </div>
    </div>
</template>