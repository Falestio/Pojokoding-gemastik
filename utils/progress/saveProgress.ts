import { collection, addDoc, Timestamp, getDocs, query, where } from "firebase/firestore";

export const saveProgress = async (userId: string, contentId: string, courseId: string, contentType: string, usersCode?: string) => {
    const { $db } = useNuxtApp();

    const newProgress = {
        userId: userId,
        contentId: contentId,
        courseId: courseId,
        type: contentType,
        usersCode: usersCode || "",
        createdAt: Timestamp.fromDate(new Date()),
    };

    console.log("New Progress Object", newProgress);

    // Get existing progress documents with the same userId and contentId
    // @ts-ignore
    const progressQuery = query(collection($db, "progress"), where("userId", "==", userId), where("contentId", "==", contentId));
    const querySnapshot = await getDocs(progressQuery);

    // If no documents found, add the progress
    if (querySnapshot.empty) {
        // @ts-ignore
        const progressRef = await addDoc(collection($db, "progress"), newProgress);
        console.log("New progress with id: ", progressRef);
    } else {
        console.log("Progress for this content already exists for this user. Not adding new progress.");
    }
};
