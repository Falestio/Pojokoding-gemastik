<script setup>
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { useToast } from "vue-toastification";
import { checkPasswordSecurity } from "~/utils/user/checkPasswordSecurity";

const route = useRoute();
const { $auth } = useNuxtApp();
const toast = useToast();

const invalidActionCode = ref(false);

const userEmail = ref("");
const actionCode = route.query.oob;
const password = ref("");
const confirmPassword = ref("");

const passwordSecurity = ref({});

watch(password, (newPassword) => {
    passwordSecurity.value = checkPasswordSecurity(newPassword);
});

onMounted(() => {
    verifyPasswordResetCode($auth, actionCode)
        .then((email) => {
            console.log("email: ", email);
            userEmail.value = email;
        })
        .catch((error) => {
            // Invalid or expired action code. Ask user to try to reset the password again.
            invalidActionCode.value = true;
            console.error("error: ", error);
        });
});

async function handleConfirmPasswordReset() {
    if (password.value !== confirmPassword.value) {
        console.error("Passwords do not match");
        return;
    }

    console.log("Passwords match");
    confirmPasswordReset($auth, actionCode, password.value)
        .then((resp) => {
            toast.success("Password berhasil diubah");
        })
        .catch((error) => {
            console.error("error: ", error);
        });
}
</script>

<template>
    <div class="flex justify-center">
        <div v-if="invalidActionCode">Invalid or expired action code. Repeat the reset password process to get a new link.</div>
        <div v-else class="mt-8 rounded border-2">
            <h2 class="bg-slate-800 text-center text-2xl py-2 p-8">Masukan Password bar</h2>
            <form class="flex flex-col gap-4 p-8 first-letter:" @submit.prevent="handleConfirmPasswordReset">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Password</span>
                    </label>
                    <input
                        v-model="password"
                        type="password"
                        placeholder="Masukan Password Anda"
                        class="input input-bordered input-primary w-full max-w-xs"
                    />
                </div>
                <div class="flex flex-col gap-4">
                    <div v-if="passwordSecurity.hasMinLength" class="text-green-500">Has at least 8 characters</div>
                    <div v-if="passwordSecurity.hasUpperCase" class="text-green-500">Has an uppercase letter</div>
                    <div v-if="passwordSecurity.hasLowerCase" class="text-green-500">Has a lowercase letter</div>
                    <div v-if="passwordSecurity.hasNumber" class="text-green-500">Has a number</div>
                    <div v-if="passwordSecurity.hasSpecialChar" class="text-green-500">Has a special character</div>
                </div>
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Konfirmasi Password</span>
                    </label>
                    <input
                        v-model="confirmPassword"
                        type="password"
                        placeholder="Konfirmasi Password Anda"
                        class="input input-bordered input-primary w-full max-w-xs"
                    />
                </div>
                <button type="submit" class="btn btn-primary text-white">Reset Password</button>
            </form>
        </div>
    </div>
</template>