<script setup>
import { getAllCoursesForHomepage } from "@/utils/content/getAllCoursesForHomepage";

const allCourses = await getAllCoursesForHomepage();
</script>

<template>
    <div>
        <!-- TODO: UI: Research first section best pratices -->
        <main class="">
            <div class="">
                <div class="flex items-center gap-20 px-[124px] pb-[180px] pt-[120px]">
                    <div class="gap flex flex-col gap-3">
                        <div class="">
                            <h2 class="text-[48px] font-semibold text-white">Selamat Datang di Pojokoding</h2>
                            <p class="text-white">Belajar tentang pengrograman tanpa mengeluarkan uang sepeser pun. Daftar sekarang!</p>
                        </div>
                        <NuxtLink to="/daftar" class="btn btn-primary">Daftar</NuxtLink>
                    </div>
                    <img src="@/assets/img/binary-code.png" alt="binary-code">
                </div>
            </div>
            <div class="flex flex-col gap-6 px-[80px] pb-16 text-white">
                <h3 class="text-2xl font-medium">Rekomendasi Untukmu</h3>
                <div class="flex gap-8">
                    <template v-for="course in allCourses" :key="course._id">
                        <div class="card bg-slate-800 shadow-xl">
                            <!-- TODO: UI: tentukan aspect ratio dari gambar -->
                            <figure>
                                <img class="w-full h-48 object-cover" :src="course.mainImage" alt="Shoes" />
                            </figure>
                            <div class="card-body">
                                <h2 class="card-title">{{ course.title }}</h2>
                                <p>{{ course.shortDescription }}</p>
                                <div class="badge badge-outline">{{ course.difficulty }}</div>
                                <div class="card-actions justify-end">
                                    <NuxtLink :to="`/${course.slug.current}`" class="btn btn-primary">Belajar sekarang</NuxtLink>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <!-- TODO: UI: standardisasi desain dari review menggunakan daisyui -->
            <div class="flex flex-col gap-6 px-[80px] pb-16 text-white">
                <h3 class="text-2xl font-medium">Testimoni dari alumni kursus</h3>
                <div class="flex flex-col gap-6">
                    <div class="flex gap-10 border border-[#865DFF]">
                        <img src="@/assets/img/zull.jpg" alt="" class="w-[272px] h-[189px] object-cover" />
                        <div class="flex flex-col justify-center gap-6">
                            <p class="text-lg">“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”</p>
                            <div class="">
                                <h4 class="text-2xl">Zulfa</h4>
                                <p>Mahasiswa Telkom University</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-10 border border-[#865DFF]">
                        <img src="@/assets/img/radit.jpg" alt="" class="w-[272px] h-[189px] object-cover" />
                        <div class="flex flex-col justify-center gap-6">
                            <p class="text-lg">“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”</p>
                            <div class="">
                                <h4 class="text-2xl">Radit</h4>
                                <p>Mahasiswa Telkom University</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-10 border border-[#865DFF]">
                        <img src="@/assets/img/hanif.jpg" alt="" class="w-[272px] h-[189px] object-cover" />
                        <div class="flex flex-col justify-center gap-6">
                            <p class="text-lg">“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”</p>
                            <div class="">
                                <h4 class="text-2xl">Hanif</h4>
                                <p>Mahasiswa Telkom University</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-[#865DFF] h-[1px] mx-24"></div>
            <footer class="flex justify-between items-center px-[80px] pt-8 pb-8 text-white">
                <h1 class="text-3xl font-bold text-[#E384FF] drop-shadow-md">PojoKoding</h1>
                <p>PojoKoding Copyright 2023</p>
            </footer>
        </main>
    </div>
</template>