<script setup>
import { renderMarkdown } from "@/utils/content/renderMarkdown";
import { generateToc } from "@/utils/content/generateToc";
const currentUser = useCurrentUser();

// TODO: Check is  it working or not
// Cek apakah plugin pada prisma bekerja atau tidak
// TODO: fungsi yang penting adalah line highliht
// bagaimana cara mengintegrasi sanity dan prisma
// sehingga penulis dapat menspesifikasikan dimana line highlight dari sanity
head: {
    script: [
        {
            type: "module",
            src: "@/assets/js/prism.js",
        },
    ];
}

const props = defineProps(["contentData", "sidebarContent"]);

const renderedArticle = renderMarkdown(props.contentData.markdown);

// TODO: Include toc
const toc = generateToc(renderedArticle);

// Quiz
const quizData = props.contentData.quiz;
</script>

<template>
    <div>
        <!-- TODO: Diawal artikel tampilkan syarat apa saja yang harus diselesaikan untu kmenyelesaikan artikel -->
        <div class="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content flex flex-col p-8">
                <!-- Page content here -->
                <!-- TODO: Buat sebuah navbar khusus mobile yang menampilkan open drawer button, dan menu untuk membuka akun -->
                <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>
                <!-- TODO: Tampilkan judul didalam h1 terpisah dengan artikel, tampilkan toc setelah judul  -->
                <!-- TODO: bagian kanan dari artikel terlihat kosong, pikirkan sesuatu untuk mengisinya -->
                <article v-html="renderedArticle" class="w-[670px] article"></article>
                <Quiz v-if="quizData" :quiz-data="quizData" :content-id="contentData._id" :course-id="contentData.course._ref" :content-type="contentData.contentType"></Quiz>
                <Discussion v-if="currentUser" :content-data="contentData"></Discussion>
            </div>

            <!-- TODO: Perbaiki warna dari sidebar sehingga match dengan navbar -->
            <div class="drawer-side">
                <label for="my-drawer-2" class="drawer-overlay"></label>
                <ul class="p-4 w-60 h-full bg-slate-800 text-base-content flex flex-col gap-2 overflow-x-hidden whitespace-normal">
                    <template v-for="content in sidebarContent" :key="content._id">
                        <NuxtLink :to="content.slug.current" :class="{ 'text-primary': content.completed }" class="hover:bg-slate-800 p-2 rounded flex items-center">
                            <Icon v-if="content.completed" name="mdi:checkbox-marked-circle" class="mr-2"></Icon>
                            <span class="text-lg">
                                {{ content.title }}
                            </span>
                        </NuxtLink>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</template>

<style >
</style>