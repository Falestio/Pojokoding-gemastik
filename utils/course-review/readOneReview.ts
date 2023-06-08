import { collection, doc, getDoc, getDocs, query, where } from "@firebase/firestore";

export const readOneReview = async (courseId: string, userId: string) => {
    const { $db } = useNuxtApp();
    // @ts-ignore
    const reviewRef = collection($db, "reviews");
    const q = query(reviewRef, where("courseId", "==", courseId), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const reviewData = querySnapshot.docs[0].data();
        // Add the document ID to the returned data
        return { id: querySnapshot.docs[0].id, ...reviewData };
    } else {
        return null;
    }
};