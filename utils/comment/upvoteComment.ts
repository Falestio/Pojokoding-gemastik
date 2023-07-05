import { doc, updateDoc , increment, arrayUnion, arrayRemove, getDoc } from "@firebase/firestore"

export const upvoteComment = async (commentId: string, userId: string) => {
    const { $db } = useNuxtApp()

    // @ts-ignore
    const commentRef = doc($db, "comments", commentId)

    const commentSnapshot = await getDoc(commentRef)
    const commentData = commentSnapshot.data()
    console.log("Comment Data", commentData)

    if (commentData?.upvotedUsers.includes(userId)) {
        // The user has already upvoted this comment. Remove the upvote.
        await updateDoc(commentRef, {
            upvote: increment(-1), 
            upvotedUsers: arrayRemove(userId)
        })
    } else {
        // The user hasn't upvoted this comment. Add the upvote.
        await updateDoc(commentRef, {
            upvote: increment(1),
            upvotedUsers: arrayUnion(userId)
        })
    }
}