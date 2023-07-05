import { query, collection, where, getDocs, orderBy } from "firebase/firestore";
import { getContentDataById } from "../content/getContentDataById";

export const getLatestUserProgress = async (userId: string, courseId: string) => {
    const { $db } = useNuxtApp()

    // @ts-ignore
    const progressRef = collection($db, "progress")
    const q = query(
      progressRef, 
      where("userId", "==", userId), 
      where("courseId", "==", courseId),
      orderBy("createdAt", "desc") // Order by createdAt in descending order
    );

    const querySnapshot = await getDocs(q);
    const progress = querySnapshot.docs.map((doc) => doc.data());
    console.log("Latest progress: ", progress[0])

    const content = await getContentDataById(progress[0].contentId)
    console.log("Latest progress content: ", content)

    return content
};