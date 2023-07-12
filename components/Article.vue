<script setup>
import { renderMarkdown } from "@/utils/content/renderMarkdown";
import { generateToc } from "@/utils/content/generateToc";
const currentUser = useCurrentUser();

// TODO: FUNC: Integrasi code highlighter
// TODO: FUNC: line Numbers
// TODO: FUNC: line highlight
// TODO: FUNC: bisa mengkontrol
// tidak bisa menggunakan prism, jadi mungkin lakukan secara manual

const props = defineProps(["contentData", "sidebarContent"]);

const renderedArticle = renderMarkdown(props.contentData.markdown);

const toc = generateToc(renderedArticle);

// Quiz
const quizData = props.contentData.quiz;
</script>

<template>
    <div>
        <!-- TODO: UI: Diawal artikel tampilkan syarat apa saja yang harus diselesaikan untu kmenyelesaikan artikel -->
        <div class="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content flex flex-col p-8">
                <!-- Page content here -->
                <!-- TODO: UI: Buat sebuah navbar khusus mobile yang menampilkan open drawer button, dan menu untuk membuka akun -->
                <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>

                <!-- TODO: UI: bagian kanan dari artikel terlihat kosong, pikirkan sesuatu untuk mengisinya -->
                <div class="w-[670px]">
                    <h1 class="text-5xl mb-4">{{ contentData.title }}</h1>
                    <div class="w-full p-5 mb-4 bg-slate-900 rounded">
                        <h1 class="text-2xl font-bold mb-4">Daftar Isi</h1>
                        <ul class="space-y-2">
                            <li v-for="item in toc" :key="item.slug" :class="item.lvl === 3 ? 'pl-4' : ''">
                                <a :href="`#${item.slug}`" class="text-primary hover:underline">
                                    {{ item.content }}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <article v-html="renderedArticle" class="article"></article>
                    <Quiz v-if="quizData" :quiz-data="quizData" :content-id="contentData._id" :course-id="contentData.course._ref" :content-type="contentData.contentType"></Quiz>
                    <Discussion v-if="currentUser" :content-data="contentData"></Discussion>
                </div>
            </div>

            <div class="drawer-side">
                <label for="my-drawer-2" class="drawer-overlay"></label>
                <ul class="p-4 w-60 h-full border-r border-gray-700 text-base-content flex flex-col gap-2 overflow-x-hidden whitespace-normal">
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

<style>
</style>