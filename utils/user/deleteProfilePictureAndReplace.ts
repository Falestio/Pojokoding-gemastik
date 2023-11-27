import { ref, deleteObject, getDownloadURL } from 'firebase/storage';
import { User, updateProfile } from 'firebase/auth';

export const deleteProfilePictureAndReplace = async (currentUser: User) => {
    if (currentUser) {
        try {
            // $ 1. Menghapus gambar profil dari Firebase Storage
            const { $storage } = useNuxtApp();
            // @ts-ignore
            const storageRef = ref($storage, `users/${currentUser.uid}/profilePicture`);
            await deleteObject(storageRef);

            // $ 2. Mengganti gambar profil dengan URL Dicebear
            const dicebearUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${currentUser.displayName}`;
            await updateProfile(currentUser, { photoURL: dicebearUrl });

            console.log("Profile picture replaced successfully!");
        } catch (error) {
            console.error("Error replacing profile picture:", error);
        }
    } else {
        console.warn('User is not provided');
    }
};
