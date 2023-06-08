import { doc, updateDoc, getDoc } from "firebase/firestore";

// TODO: should bea able to change rating
export const editReview = async (reviewId: string, newReviewContent: string) => {
    const { $db } = useNuxtApp();
    console.log("REVIEW ID", reviewId);
    console.log("NEW REVIEW CONTENT", newReviewContent);
    // @ts-ignore    
    const reviewRef = doc($db, "reviews", reviewId);
    console.log("REVIEW REF", reviewRef)

    await updateDoc(reviewRef, {
        content: newReviewContent
    })

    const updatedReview = await getDoc(reviewRef);
    console.log("UPDATED REVIEW", updatedReview.data())

    return updatedReview.data();
}