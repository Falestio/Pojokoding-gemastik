import { collection, getDocs, orderBy, query, startAfter, where, limit } from "@firebase/firestore"

export const readAllComment = async (articleId: string, startAfterCursor = null) => {
    const { $db } = useNuxtApp()
    // @ts-ignore   
    const commentsRef = collection($db, "comments")
    let q = query(commentsRef, where("articleId", "==", articleId), orderBy('upvote', 'desc'), limit(5));

    if (startAfterCursor) {
        q = query(commentsRef, where("articleId", "==", articleId), orderBy('upvote', 'desc'), startAfter(startAfterCursor), limit(5));
    }

    const querySnapshot = await getDocs(q)

    const comments: any[] = []

    querySnapshot.forEach((doc) => {
        comments.push({
            id: doc.id,
            ...doc.data()
        })
    })
    
    // return last document as the cursor for the next pagination
    const cursor = querySnapshot.docs[querySnapshot.docs.length-1];
    return { comments, cursor }
}