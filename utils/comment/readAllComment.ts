import { collection, getDocs, query, where } from "@firebase/firestore"

export const readAllComment = async (articleId: string) => {
    const { $db } = useNuxtApp()
    // @ts-ignore
    const commentsRef = collection($db, "comments")
    const q = query(commentsRef, where("articleId", "==", articleId))

    const querySnapshot = await getDocs(q)

    const comments: any[] = []

    querySnapshot.forEach((doc) => {
        comments.push({
            id: doc.id,
            ...doc.data()
        })
    })
    

    return comments
}