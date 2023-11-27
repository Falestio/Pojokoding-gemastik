// @ts-nocheck
import { GoogleAuthProvider, signInWithPopup, fetchSignInMethodsForEmail } from "firebase/auth";
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore";

export const googleAuth = () => {
    return new Promise((resolve, reject) => {
        const provider = new GoogleAuthProvider();
        const db = getFirestore();

        const { $auth } = useNuxtApp();
        $auth.useDeviceLanguage();

        signInWithPopup($auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;

                console.log("User: ", user);
                console.log("Token: ", token);

                const signInMethods = await fetchSignInMethodsForEmail($auth, user.email);

                if (signInMethods.length > 0 && !signInMethods.includes("google.com")) {
                    // The user has an existing account with a different provider
                    // Deny login/registration with Google
                    throw new Error("An account with this email already exists with a different sign-in method.");
                }

                // Check if this user is already in the Firestore database
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);

                if (!docSnap.exists()) {
                    // User doesn't exist, create a new document in 'users' collection
                    const data = { premium: false };
                    await setDoc(doc(db, "users", user.uid), data);
                    console.log("New user created in Firestore");
                } else {
                    console.log("User already exists in Firestore");
                }

                console.log("User signed in successfully")
                resolve(user); // Resolve the promise with the user data
            })
            .catch((error) => {
                // Handle Errors here.
                console.log("Error")
                console.log("Error code: ", error.code);
                console.log("Error message: ", errorMessage);
                reject(error); // Reject the promise on error
            });
    });
};
