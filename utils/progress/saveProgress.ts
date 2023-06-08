import { collection, addDoc } from "firebase/firestore"

export const saveProgress = async (userId: string, contentId: string, courseId: string, contentType: string, usersCode?: string) => {
  const { $db } = useNuxtApp()

  const newProgress = {
    userId: userId,
    contentId: contentId,
    courseId: courseId,
    type: contentType,
    usersCode: usersCode || ""  // Add usersCode to the object, or empty string if it's undefined
  }

  console.log("New Progress Object", newProgress)

  // @ts-ignore
  const progressRef = await addDoc(collection($db, "progress"), newProgress)
  console.log("New progress with id: ", progressRef)
}