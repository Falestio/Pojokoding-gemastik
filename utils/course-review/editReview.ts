import { doc, updateDoc, getDoc } from "firebase/firestore";

export const editReview = async (reviewId: string, newReviewContent: string, newReviewRating: number) => {
    const { $db } = useNuxtApp();
    console.log(newReviewContent, newReviewRating)

    // @ts-ignore    
    const reviewRef = doc($db, "reviews", reviewId);

    await updateDoc(reviewRef, {
        content: newReviewContent,
        rating:  newReviewRating
    })

    const updatedReview = await getDoc(reviewRef);

    return updatedReview.data();
}