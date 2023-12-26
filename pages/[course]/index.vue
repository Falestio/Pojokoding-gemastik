<script setup>
import { getOneCourse } from "@/utils/content/getOneCourse";
import { readAllReview } from "@/utils/course-review/readAllReview";

const route = useRoute();
const courseSlug = route.params.course;
const courseData = await getOneCourse(courseSlug);

// GET REVIEWS
const allReviewsInCourse = ref([]);
const reviewCursor = ref(null);

async function handleGetAllReviews() {
    console.log("GETTING ALL REVIEWS: ", courseData.value._id)
    const result = await readAllReview(courseData.value._id);
    allReviewsInCourse.value = result.reviews;
    reviewCursor.value = result.cursor;
}

async function handleGetMoreReviews() {
    if (reviewCursor.value) {
        const result = await readAllReview(courseData.value._id, reviewCursor.value);
        allReviewsInCourse.value = [...allReviewsInCourse.value, ...result.reviews];
        reviewCursor.value = result.cursor;
    }
}

if(process.client && courseData.value){
    await handleGetAllReviews();
}
</script>

<template>
    <!-- TODO: Lebih ada spacing lagi antara heading dan text sehingga mudah dibaca, mungkin masukan ke dalam box  -->
    <div class="mt-8">
        <div class="bg-[#191825] con text-white">
            <div class="grid grid-cols-3 gap-4">
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
                        <h2 class="text-2xl">Daftar Modul</h2>

                        <ul class="space-y-4" v-if="courseData.subcourses">
                            <template v-for="subcourse in courseData.subcourses" :key="subcourse.title">
                                <details class="collapse collapse-arrow bg-base-200">
                                    <summary class="collapse-title text-xl font-medium">
                                        {{ subcourse.title }}
                                    </summary>
                                    <div class="collapse-content">
                                        <!-- TODO: ada berapa latihan dan artikel dalam setiap subcourse  -->
                                        <div v-for="content in subcourse.contents" :key="content.displayTitle" class="card">
                                            <NuxtLink :to="`/${courseData.slug.current}/${content.slug.current}`" class="flex rounded items-center gap-2 p-2 hover:bg-slate-800">
                                                <Icon v-if="content.contentType == 'exercise'" name="ph:terminal-window" class="text-lg"></Icon>
                                                <Icon v-if="content.contentType == 'post'" name="ph:article-light" class="text-lg"></Icon>
                                                <p class="text-lg">{{ content.displayTitle }}</p>
                                            </NuxtLink>
                                        </div>
                                    </div>
                                </details>
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
                        <!-- TODO: Jika tidak ada review jangan ditampilkan -->
                        <h2 class="text-2xl">Review</h2>
                        <div v-for="review in allReviewsInCourse" :key="review.id" class="flex flex-col space-y-2 p-4 bg-slate-800 shadow rounded-md mb-4">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-2">
                                    <!-- TODO: image does not shown -->
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
                                <!-- TODO: diubah menjad "3 days ago..." -->
                                <p class="text-xs text-gray-500">{{ new Date(review.createdAt.seconds * 1000).toLocaleDateString() }}</p>
                            </div>
                            <p class="text-sm">{{ review.content }}</p>
                        </div>
                        <!-- TODO: tampilkan loading state -->
                        <button @click="handleGetMoreReviews" class="btn btn-primary">Muat Lebih Banyak</button>
                    </div>
                </main>
                <div class="col-span-1">
                    <!-- TODO: selain gambar dan tombol, tampilkan juga rangkuman dari kursus -->
                    <!-- TODO: tampilkan progress -->
                    <div class="sticky top-4">
                        <img v-if="courseData.image" :src="courseData.image" alt="gambar" class="bg-slate-400 h-64 w-ful object-cover rounded" />
                        <div class="text-xl">
                            <div class="flex h-10 gap-3 mt-3">
                                <NuxtLink
                                    v-if="courseData?.slug?.current && courseData?.subcourses?.[0]?.contents?.[0]?.slug?.current"
                                    :to="`/${courseData.slug.current}/${courseData.subcourses[0].contents[0].slug.current}`"
                                    class="btn btn-primary w-full text-white"
                                    data-cy="course-page-mulai-belajar"
                                >
                                    Mulai Belajar
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
