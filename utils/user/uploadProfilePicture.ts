// @ts-nocheck
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { User, updateProfile } from 'firebase/auth'

export const uploadProfilePicture = async (file: any, currentUser: User) => {
    if(file && currentUser) {    
        const { $storage } = useNuxtApp()
        const storageRef = ref($storage, `users/${currentUser.uid}/profilePicture`)
        const snapshot = await uploadBytes(storageRef, file)
        const pictureUrl = await getDownloadURL(snapshot.ref)
        await updateProfile(currentUser, { photoURL: pictureUrl})
    } else {
        alert('File or user is not provided')
    }
}