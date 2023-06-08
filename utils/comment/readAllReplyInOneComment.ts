import { collection, getDocs, query, where } from "@firebase/firestore"

export const readAllReplyInOneComment = async (commentId: string) => {
    const { $db } = useNuxtApp()

    const replyRef = collection($db, "replies")
    const q = query(replyRef, where("commentId", "==", commentId))

    const querySnapshot = await getDocs(q)

    const replies: any[] = []

    querySnapshot.forEach((doc) => {
        replies.push({
            id: doc.id,
            ...doc.data()
        })
    })
    

    return replies
}