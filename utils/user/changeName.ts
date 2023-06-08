// @ts-nocheck
import { updateProfile } from "firebase/auth";

export const changeName = async (newName: string, oldName: string) => {
    const { $auth } = useNuxtApp()
    
    console.log(newName, oldName);
    try {
        await updateProfile($auth.currentUser, { displayName: newName })
        alert("berhasil mengganti nama")
    } catch (error) {
        console.log(error);
    }
    
}