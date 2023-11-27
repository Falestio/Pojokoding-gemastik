// @ts-nocheck
import { signInWithEmailAndPassword } from '@firebase/auth';
import { useToast } from "vue-toastification";

const toast = useToast();

export const userLogin = async (email: string, password: string) => {
    const { $auth } = useNuxtApp()

    try {
        const loggedInUser = await signInWithEmailAndPassword($auth, email, password)
        return loggedInUser;
    } catch (error) {
        switch (error.code) {
            case "auth/invalid-email":
                toast.error("Email tidak valid", { timeout: 4000 });
                break;
            case "auth/user-disabled":
                toast.error("User sudah dinonaktifkan oleh administrator", { timeout: 4000 });
                break;
            case "auth/user-not-found":
                toast.error("User tidak ditemukan", { timeout: 4000 });
                break;
            case "auth/wrong-password":
                toast.error("Password salah", { timeout: 4000 });
                break;
            default:
                toast.error("Unknown error occured", { timeout: 4000 });
                break;
        }
    }
}