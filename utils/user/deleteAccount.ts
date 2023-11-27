import { deleteUser } from "firebase/auth";

export const deleteAccount = async (currentUser: any) => {
    if (currentUser) {
        try {
            await deleteUser(currentUser);
        } catch (error) {
            console.log(error);
        }
    }
};
