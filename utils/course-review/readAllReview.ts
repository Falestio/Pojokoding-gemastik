import { getDoc, doc, collection, getDocs, query, where } from "firebase/firestore"

export const readAllReview = async (courseId: string) => {
    const { $db } = useNuxtApp()
    // @ts-ignore
    const reviewsRef = collection($db, "reviews")
    const q = query(reviewsRef, where("courseId", "==", courseId))
    const querySnapshot = await getDocs(q)
    const reviews :any[] = []
    querySnapshot.forEach((doc) => {
        const review = doc.data()
        // @ts-ignore
        review.id = doc.id
        reviews.push(review)
    })
    return reviews
}