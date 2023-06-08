import { doc, updateDoc , increment} from "@firebase/firestore"

export const upvoteReply = async (replyId: string) => {
    const { $db } = useNuxtApp()

    const replyRef = doc($db, "replies", replyId)

    await updateDoc(replyRef, {
        upvote: increment(1)
    })
}