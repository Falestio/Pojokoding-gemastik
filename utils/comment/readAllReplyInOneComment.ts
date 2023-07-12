import { collection, getDocs, query, where, orderBy } from "@firebase/firestore"

export const readAllReplyInOneComment = async (commentId: string) => {
    const { $db } = useNuxtApp()

    // @ts-ignore
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

    // sort array of object by createdAt ASC
    const sortedReplies = replies.sort((a, b) => {
        return a.createdAt - b.createdAt
    })

    return replies
}