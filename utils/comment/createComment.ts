import { collection, addDoc } from "firebase/firestore"

export const createComment = async (newCommentContent: string, articleId: string, uid: string, username: string, photoUrl: string) => {
    const { $db } = useNuxtApp()
    
    const newComment = {
        articleId: articleId,
        userId: uid,
        content: newCommentContent,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: username,
        photoUrl: photoUrl,
        upvote: 0
    }

    // @ts-ignore
    const commentRef = await addDoc(collection($db, "comments"), newComment)

    console.log("New Comment:", commentRef)
}