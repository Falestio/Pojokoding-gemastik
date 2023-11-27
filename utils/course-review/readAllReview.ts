import { collection, getDocs, orderBy, query, startAfter, where, limit } from "@firebase/firestore";

export const readAllReview = async (courseId: string, startAfterCursor = null) => {
    const { $db } = useNuxtApp();
    // @ts-ignore
    const reviewsRef = collection($db, "reviews");
    console.log(reviewsRef);

    let q = query(reviewsRef, where("courseId", "==", courseId), orderBy("createdAt", "desc"), limit(3));

    if (startAfterCursor) {
        q = query(reviewsRef, where("courseId", "==", courseId), orderBy("createdAt", "desc"), startAfter(startAfterCursor), limit(3));
    }

    const querySnapshot = await getDocs(q);

    const reviews: any[] = [];

    querySnapshot.forEach((doc) => {
        reviews.push({
            id: doc.id,
            ...doc.data(),
        });
    });

    // return last document as the cursor for the next pagination
    const cursor = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { reviews, cursor };
};
