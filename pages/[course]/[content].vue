<script setup>
import { useContentStore } from "@/stores/content";
import { useProgressStore } from "@/stores/progress";

definePageMeta({ layout: "empty" });

const currentUser = useCurrentUser();
const route = useRoute();
const contentSlug = route.params.content;
const courseSlug = route.params.course;

const contentStore = useContentStore();
const progressStore = useProgressStore();

// Fetch content data
await contentStore.fetchContentData(contentSlug, courseSlug);

// Function to fetch and update user's progress
async function handleGetUsersProgress() {
    if (currentUser.value && contentStore.contentData) {
        await progressStore.fetchUserProgress(currentUser.value.uid, contentStore.contentData.course._ref);
        contentStore.updateSidebarContent(progressStore.userProgress);
    }
}

if (currentUser.value) {
    await handleGetUsersProgress();
}

watch(currentUser, async (newValue, oldValue) => {
    if (newValue) {
        await handleGetUsersProgress();
    }
});
</script>

<template>
    <div>
        <!-- TODO: Tampilkan subcourses pada sidebar -->
        <!-- TODO: Jumlah artikel dan latihan dijadikan dynamic -->
        <TheNavbar></TheNavbar>
        <Article v-if="contentStore.contentData.contentType == 'post'"></Article>
        <Exercise v-if="contentStore.contentData.contentType == 'exercise'"></Exercise>
        <!-- <p>Updated Sidebar</p>
        <pre>
            {{ contentStore.sidebarContent }}
        </pre>
        <p>Content Data</p>
        <pre>
            {{ contentStore.contentData }}
        </pre> -->
    </div>
</template>

<style>
pre {
    white-space: pre-wrap; /* Since CSS 2.1 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
}


</style>