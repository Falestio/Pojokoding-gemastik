// @ts-nocheck
import { sendEmailVerification } from "firebase/auth"

export const resendEmailVerification = async () => {
    const { $auth } = useNuxtApp();

    try {
        await sendEmailVerification($auth.currentUser);
        return true;
    } catch (error) {
        console.error("Error during user registration: ", error);
        throw error; // Rethrow the error so it can be handled further up the chain if needed
    }
}