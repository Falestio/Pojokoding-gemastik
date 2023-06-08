// @ts-nocheck
import { signInWithEmailAndPassword } from '@firebase/auth';

export const userLogin = async (email: string, password: string) => {
    const { $auth } = useNuxtApp()

    try {
        const loggedInUser = await signInWithEmailAndPassword($auth, email, password)
        return loggedInUser;
    } catch (error) {
        console.error("Error during user registration: ", error);
        throw error; // Rethrow the error so it can be handled further up the chain if needed        
    }
}