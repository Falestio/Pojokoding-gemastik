import { onAuthStateChanged } from "@firebase/auth";
import { useCurrentUser } from "../composables/useCurrentUser";

// TODO: FUNC: Make the users available before page load (server side)
export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.client) {
        const { $auth } = useNuxtApp();
        const userState = useCurrentUser();

        console.log("User state sebelum onAuthStateChange: ", userState.value);
        // @ts-ignore
        onAuthStateChanged($auth, async (user) => {
            console.log("Didalam OnAuthStateChanged: ", user)
            if (user) {
                // @ts-ignore
                userState.value = user;
            } else {
                userState.value = null;
            }
        });
    }
});
    