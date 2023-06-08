// @ts-nocheck
import { query, collection, where, getDocs } from "firebase/firestore";

export const getProgressDashboard = async (userId: string) => {
    const { $db } = useNuxtApp();

    // fetch semua progress yang dimiliki user
    const progressRef = collection($db, "progress");
    const q = query(progressRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const progress = querySnapshot.docs.map((doc) => doc.data());
    console.log("Progress for this user: ", progress);

    // extract courseId yang muncul, ambil satu kali, jika course id sudah ada, maka tidak perlu diambil lagi
    const courseIdList = progress.map((item) => item.courseId);
    const uniqueCourseIdList = [...new Set(courseIdList)];
    console.log("Unique course id list: ", uniqueCourseIdList);

    // fetch data semua course dari sanity yang muncul di progress yang dimiliki user
    let courseData = [];
    for (const courseId of uniqueCourseIdList) {
        const courseQuery = groq`*[_type == "course" && _id == "${courseId}"][0]`;
        const { data: courseResult } = await useSanityQuery(courseQuery);
        courseData.push(courseResult.value);
    }
    console.log("Course data: ", courseData);

    // untuk setiap courseData, iterasi usersProgress
    // jika courseId dari courseData sama dengan item usersProgress maka tambah artikelSelesai atau latihanSelesai
    // setelah selesai, push properti artikelSelesai dan latihanSelesai ke courseData
    for (const course of courseData) {
        let finishedArticle = 0;
        let finishedExercise = 0;
        for (const item of progress) {
            // @ts-ignore
            if (item.courseId === course._id) {
                if (item.type === "post") {
                    finishedArticle++;
                } else if (item.type === "exercise") {
                    finishedExercise++;
                }
            }
        }
        // @ts-ignore
        course.finishedArticle = finishedArticle;
        // @ts-ignore
        course.finishedExercise = finishedExercise;
        const totalItems = course.postCount + course.exerciseCount;
        const totalCompleted = finishedArticle + finishedExercise;
        // @ts-ignore
        course.completionPercentage = totalItems > 0 ? (totalCompleted / totalItems) * 100 : 0;
        console.log("Individual Course When injecting artikelselesai: ", course);
    }

    console.log("Course data FINAL: ", courseData);

    return courseData;
};
