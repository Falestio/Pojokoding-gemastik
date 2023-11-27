// @ts-nocheck
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

export const userRegister = async (email, password, username) => {
    const { $auth, $db } = useNuxtApp();
    
    try {
        // Create the user in Firebase Auth
        const registeredUser = await createUserWithEmailAndPassword($auth, email, password);

        // Update display name and photo URL
        await updateProfile($auth.currentUser, {
            displayName: username,
            photoURL: `https://avatars.dicebear.com/api/micah/${username}.svg`
        });

        // create metadata for that user in firestore
        const data = {
            premium: false,
        }
        await setDoc(doc($db, "users", $auth.currentUser.uid), data);

        // send email verification
        await sendEmailVerification($auth.currentUser);

        // Fetch the latest user data after updating the profile
        const updatedUser = $auth.currentUser;

        return updatedUser;
    } catch (error) {
        console.error("Error during user registration: ", error);
        throw error; // Rethrow the error so it can be handled further up the chain if needed
    }
}