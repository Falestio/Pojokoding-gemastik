import { deleteDoc, doc } from "firebase/firestore"

export const deleteReply = async (replyId: string) => {
    const { $db } = useNuxtApp()
    //@ts-ignore
    const replyRef = doc($db, "replies", replyId);
    await deleteDoc(replyRef)
}