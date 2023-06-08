import { deleteDoc, doc } from "firebase/firestore"

export const deleteComment = async (commentId: string) => {
    const { $db } = useNuxtApp()
    // @ts-ignore
    const commentRef = doc($db, "comments", commentId);
    await deleteDoc(commentRef)
}