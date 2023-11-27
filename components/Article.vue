<script setup>
import { renderMarkdown } from "@/utils/content/renderMarkdown";
import { generateToc } from "@/utils/content/generateToc";
import { useContentStore } from "@/stores/content";

const currentUser = useCurrentUser();
const contentStore = useContentStore();
const progressStore = useProgressStore();

const renderedArticle = renderMarkdown(contentStore.contentData.markdown);
const toc = generateToc(renderedArticle);

// Quiz
const quizData = contentStore.contentData.quiz;

// Cek apakah sekarang user sudah menyelesaikan konten
const isContentCompleted = computed(() => {
    return contentStore.contentData.sidebar.some((item) => {
        return item._id === contentStore.contentData._id && item.completed;
    });
});
</script>

<template>
    <div>
        <div class="drawer lg:drawer-open">
            <input id="article-sidebar" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content flex gap-12 p-8">
                <!-- $ Page Content -->
                <div class="w-[800px]">
                    <h1 class="text-5xl mb-4">{{ contentStore.contentData.displayTitle }}</h1>
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
                    <Quiz v-if="quizData" :is-content-completed="isContentCompleted"></Quiz>
                    <Discussion v-if="currentUser" :content-data="contentStore.contentData"></Discussion>
                </div>
                <div>
                    <div class="flex flex-col">
                        <!-- <img src="https://i.pinimg.com/564x/09/42/38/094238d04885b37b694617f0ba59d227.jpg" alt="ads"> -->
                    </div>
                </div>
            </div>

            <div class="drawer-side">
                <label for="article-sidebar" class="drawer-overlay"></label>
                <ul class="p-4 w-60 h-full border-r border-gray-700 bg-slate-900 text-base-content flex flex-col gap-2 overflow-x-hidden whitespace-normal">
                    <template v-for="content in contentStore.sidebarContent" :key="content._id">
                        <NuxtLink :to="content.slug.current" :class="{ 'text-primary': content.completed }" class="hover:bg-slate-800 p-2 rounded flex items-center">
                            <Icon v-if="content.completed" name="mdi:checkbox-marked-circle" class="mr-2 min-w-min"></Icon>
                            <span class="text-lg">
                                {{ content.displayTitle }}
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