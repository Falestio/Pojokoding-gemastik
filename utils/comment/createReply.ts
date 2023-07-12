import { collection, addDoc } from "firebase/firestore"

export const createReply = async (newReplyContent: string, commentId: string, uid: string, username: string, photoUrl: string) => {
    const { $db } = useNuxtApp()
    
    const newReply = {
        commentId: commentId,
        userId: uid,
        content: newReplyContent,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: username,
        photoUrl: photoUrl,
        upvote: 0,
        upvotedUsers: []
    }

    //@ts-ignore
    const replyRef = await addDoc(collection($db, "replies"), newReply)

    console.log("New Reply:", replyRef)
}