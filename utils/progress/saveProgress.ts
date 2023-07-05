import { collection, addDoc, Timestamp } from "firebase/firestore"

// TODO: prevent add progress twice
export const saveProgress = async (userId: string, contentId: string, courseId: string, contentType: string, usersCode?: string) => {
  const { $db } = useNuxtApp()

  const newProgress = {
    userId: userId,
    contentId: contentId,
    courseId: courseId,
    type: contentType,
    usersCode: usersCode || "",
    createdAt: Timestamp.fromDate(new Date())
  }

  console.log("New Progress Object", newProgress)

  // @ts-ignore
  const progressRef = await addDoc(collection($db, "progress"), newProgress)
  console.log("New progress with id: ", progressRef)
}