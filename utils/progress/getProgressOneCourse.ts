import { query, collection, where, getDocs } from "firebase/firestore"

export const getProgressOneCourse = async (userId: string, courseId: string) => {
    const { $db } = useNuxtApp()

    // @ts-ignore
    const progressRef = collection($db, "progress")
    const q = query(progressRef, where("userId", "==", userId), where("courseId", "==", courseId))
    const querySnapshot = await getDocs(q)
    const progress = querySnapshot.docs.map((doc) => doc.data())

    console.log("Progress for this course: ", progress)
    return progress

}