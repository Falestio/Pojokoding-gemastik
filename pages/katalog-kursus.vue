<script setup>
import { getAllCoursesForCatalog } from "@/utils/content/getAllCoursesForCatalog";

const coursesData = await getAllCoursesForCatalog();
</script>

<template>
    <div class="con mt-8">
        <h1 class="text-4xl font-bold mb-8">Katalog Kursus</h1>
        <div class="grid grid-cols-3 gap-4 min-h-screen">
            <template v-for="course in coursesData" :key="course._id">
                <NuxtLink :to="`/${course.slug.current}`">
                    <div class="card card-compact bg-slate-900 hover:bg-slate-800 shadow-xl">
                        <figure><img :src="course.mainImage" alt="Shoes" class="w-full h-56 bg-cover"/></figure>
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
.con { 
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}
@media (min-width: 768px) {
  .con {
    width: 750px;
  }
}
@media (min-width: 992px) {
  .con {
    width: 970px;
  } 
}
@media (min-width: 1200px) {
  .con {
    width: 1170px;
  }
}
</style>