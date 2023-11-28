//@ts-nocheck
import { defineStore } from "pinia";
import { getContentData } from "@/utils/content/getContentData";

// stores/content.js
export const useContentStore = defineStore("content", () => {
    const contentData = ref(null);
    const sidebarContent = ref([]);

    async function fetchContentData(contentSlug, courseSlug) {
        contentData.value = await getContentData(contentSlug, courseSlug);
        sidebarContent.value = contentData.value ? contentData.value.sidebar : [];
    }

    function updateSidebarContent(userProgress) {
        if (sidebarContent.value) {
            sidebarContent.value.forEach((item) => {
                const match = userProgress.some((completedItem) => completedItem.contentId === item._id);
                if (match) {
                    item.completed = true;
                }
            });
        }
    }

    return {
        contentData,
        sidebarContent,
        fetchContentData,
        updateSidebarContent,
    };
});
