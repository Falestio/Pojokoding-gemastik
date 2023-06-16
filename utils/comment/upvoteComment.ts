import { doc, updateDoc , increment} from "@firebase/firestore"

export const upvoteComment = async (commentId: string) => {
    const { $db } = useNuxtApp()

    // @ts-ignore
    const commentRef = doc($db, "comments", commentId)

    await updateDoc(commentRef, {
        upvote: increment(1)
    })
}