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
</script>

<template>
    <div class="mt-8">
        <div class="bg-[#191825] con text-white grid grid-cols-3 gap-4">
            <main class="flex flex-col gap-6 col-span-2">
                <div class="flex flex-col">
                    <h2 class="text-5xl font-medium">{{ courseData.title }}</h2>
                    <p>{{ courseData.shortDescription }}</p>
                </div>
                <div>
                    <h2 class="text-2xl">Yang akan dipelajari</h2>
                    <p>{{ courseData.learningObjectives }}</p>
                </div>
                <div class="flex flex-col gap-2">
                    <!-- TODO: FUNC: display subcourses -->
                    <h2 class="text-2xl">Materi Kursus</h2>
                    <p>{{ courseData.postCount }} Artikel - {{ courseData.exerciseCount }} Latihan</p>

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
                <!-- TODO: FUNC: fetch 3 reviews on page load -->
                <div class="flex flex-col gap-2">
                    <h2 class="text-2xl">Review</h2>
                    <button v-if="!allReviewInCourse" @click="handleGetAllReview()" class="btn">Tampilkan Review</button>
                    <div v-for="review in allReviewInCourse" :key="review.id" class="flex flex-col space-y-2 p-4 bg-slate-800 shadow rounded-md mb-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <img :src="review.photoUrl" alt="User avatar" class="w-8 h-8 rounded-full" />
                                <div>
                                    <p class="text-sm font-bold">{{ review.username }}</p>
                                    <div class="relative">
                                        <div class="absolute w-full h-full top-0 left-0 z-10" />
                                        <div class="rating">
                                            <input type="radio" value="1" v-model="review.rating" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                            <input type="radio" value="2" v-model="review.rating" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                            <input type="radio" value="3" v-model="review.rating" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                            <input type="radio" value="4" v-model="review.rating" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                            <input type="radio" value="5" v-model="review.rating" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p class="text-xs text-gray-500">{{ new Date(review.createdAt.seconds * 1000).toLocaleDateString() }}</p>
                        </div>
                        <p class="text-sm">{{ review.content }}</p>
                    </div>
                </div>
            </main>
            <!-- TODO: UI: make it sticky -->
            <div class="h-auto">
                <img :src="courseData.image" alt="gambar" class="bg-slate-400 h-64 w-ful object-cover rounded" />
                <div class="text-xl">
                    <div class="flex h-10 gap-3 mt-3">
                        <NuxtLink :to="`/${courseData.slug.current}/${courseData.content[0].slug.current}`" class="btn btn-primary w-full text-white">Mulai Belajar</NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>