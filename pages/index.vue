<script setup>

useHead({
    title: "Pojokoding",
});

const { pending: allCoursePending, data: allCourses } = await useLazyFetch("/api/content/get-all-courses-for-homepage");
console.log("All Courses", allCourses.value);
</script>

<template>
    <div>
        <!-- TODO: add animation -->
        <main class="con">
            <div class="py-12">
                <div class="flex items-center gap-20">
                    <div class="gap flex flex-col gap-3">
                        <div class="">
                            <!-- TODO: ganti copywriting -->
                            <h2 class="text-[48px] font-semibold text-white">Selamat Datang di Pojokoding</h2>
                            <p class="text-white">Belajar tentang pengrograman tanpa mengeluarkan uang sepeser pun. Daftar sekarang!</p>
                        </div>
                        <!-- TODO: Hilangkan tombol daftar jika sudah login -->
                        <NuxtLink to="/daftar" class="btn btn-primary">Daftar</NuxtLink>
                    </div>
                    <!-- TODO: ganti img -->
                    <img src="@/assets/img/binary-code.png" alt="binary-code" class="hidden lg:block" />
                </div>
            </div>
            <div class="flex flex-col gap-6 text-white mt-16">
                <h3 class="text-2xl font-medium">Rekomendasi Untukmu</h3>
                <div v-if="allCoursePending">
                    <span class="loading loading-bars loading-md"></span>
                </div>
                <div v-if="!allCoursePending" class="grid grid-cols-3 gap-4">
                    <template v-for="course in allCourses" :key="course._id">
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
            <div class="flex flex-col gap-6 text-white mt-16">
                <h3 class="text-2xl font-medium">Testimoni Dari Alumni</h3>
                <div class="flex flex-col gap-6">
                    <div class="flex gap-10 border border-primary">
                        <img src="@/assets/img/zull.jpg" alt="" class="w-60 h-60 object-cover" />
                        <div class="flex flex-col justify-center gap-6">
                            <p class="text-lg">Fitur latihan di Pojokokding sangat membantu saya dalam memahami pemrograman</p>
                            <div class="">
                                <h4 class="text-2xl">Zulfa</h4>
                                <p>Mahasiswa Telkom University</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-10 border border-primary rounded">
                        <img src="@/assets/img/radit.jpg" alt="" class="w-60 h-60 object-cover" />
                        <div class="flex flex-col justify-center gap-6">
                            <p class="text-lg">Saya dapat langsung menguji pemahaman saya dengan mencoba menyelesaikan tantangan pemrograman dan melihat hasilnya secara interaktif.</p>
                            <div class="">
                                <h4 class="text-2xl">Radit</h4>
                                <p>Mahasiswa Telkom University</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-10 border border-primary rounded">
                        <img src="@/assets/img/hanif.jpg" alt="" class="w-60 h-60 object-cover" />
                        <div class="flex flex-col justify-center gap-6">
                            <p class="text-lg">Disini adminnya sangat membantu, setiap aku ada kesulitan pasti langsung dibantu</p>
                            <div class="">
                                <h4 class="text-2xl">Hanif</h4>
                                <p>Mahasiswa Telkom University</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>