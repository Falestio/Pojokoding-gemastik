<script setup>
// TODO: make sure its crawable by google

import { getContentData } from "@/utils/content/getContentData";
import { getProgressOneCourse } from "@/utils/progress/getProgressOneCourse"

const currentUser = useCurrentUser()

definePageMeta({
    layout: "empty",
});

const route = useRoute();
const contentSlug = route.params.content;
const courseSlug = route.params.course;

const contentData = await getContentData(contentSlug, courseSlug);

const sidebarContent = ref(contentData.sidebar)

// Get users progress for sidebar
async function handleGetUsersProgress(){
    const completedContents = await getProgressOneCourse(currentUser.value.uid, contentData.course._ref)

    sidebarContent.value.forEach((item) => {
        const match = completedContents.some((completedItem) => completedItem.contentId === item._id);
        if (match) {
            item.completed = true;
        }
    });
    
    console.log("sidebar content", sidebarContent.value)
}

if(currentUser.value){
    await handleGetUsersProgress()
}

watch(currentUser,  async (newValue, oldvalue) => {
    await handleGetUsersProgress()
})
</script>

<template>
    <div>
        <TheNavbar></TheNavbar>
        <Article :content-data="contentData" :sidebar-content="sidebarContent" v-if="contentData.contentType == 'post'"></Article>
        <Exercise :content-data="contentData" :sidebar-content="sidebarContent" v-if="contentData.contentType == 'exercise'"></Exercise>
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