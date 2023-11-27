// @ts-nocheck
import { defineStore } from "pinia";
import { getProgressOneCourse } from "~/utils/progress/getProgressOneCourse";

export const useProgressStore = defineStore("progress", () => {
    const userProgress = ref([]);

    async function fetchUserProgress(userId, courseId) {
        userProgress.value = await getProgressOneCourse(userId, courseId);
    }

    return {
        userProgress,
        fetchUserProgress,
    };
});
