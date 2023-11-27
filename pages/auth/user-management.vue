<script setup>
import { applyActionCode } from "firebase/auth";

const route = useRoute();
const mode = route.query.mode;
const actionCode = route.query.oobCode;
const { $auth } = useNuxtApp();

switch (mode) {
    case "resetPassword":
        // login page > reset password > masukan email > email sudah dikirim ikuti instruksi > user klik link
        // ke halaman user management > ke halaman minta password baru > proses password baru
        // sign-in user otomatis >  ke dashboard
        await navigateTo({
            path: "/auth/confirm-reset-password",
            query: {
                oob: actionCode
            }
        })

        break;
    case "recoverEmail":
        // Display email recovery handler and UI.
        // handleRecoverEmail(auth, actionCode, lang);
        break;
    case "verifyEmail":
        // ALUR 1
        // daftar > sendEmailNotification > halaman "cek email anda" > resend email (jika perlu)
        // user click verification link > user-management page > verify verifyEmail > dashboard
        
        // ALUR 2
        // dashboard > resendEmailNotification > notifikasi "cek email anda" > user click verification link
        // user-management page > verify verifyEmail > dashboard 
        console.log("action code: ", actionCode)
        applyActionCode($auth, actionCode).then((resp) => {
            // $ Email address verified!
            console.log("Email address verified!. RESP: ", resp)
            $auth.currentUser.reload().then(() => {
                console.log({emailVerified: user.emailVerified})
            })
            // $ mavigate to dashboard with verified=true
            navigateTo("/dashboard?tab=akunku?verified=true")
        })
        break;
    default:
        console.log("invalid Mode")
}
</script>

<template>
    <div>Loading...</div>
</template>