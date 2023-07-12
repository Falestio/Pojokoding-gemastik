import { doc, updateDoc } from "@firebase/firestore"

export const updateReply = async (replyId: string, updateReplyContent: string) => {
    const { $db } = useNuxtApp()

    // @ts-ignore
    const replyRef = doc($db, "replies", replyId)

    await updateDoc(replyRef, {
        content: updateReplyContent,
        updatedAt: new Date()
    })
}