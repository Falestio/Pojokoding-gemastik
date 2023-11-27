<script setup>
import { sendPasswordResetEmail } from "firebase/auth";

const { $auth } = useNuxtApp()
const email = ref('')
const emailSent = ref(false)

async function resetPassword() {
    try {
        await sendPasswordResetEmail($auth, email.value)
        emailSent.value = true
    } catch (error) {
        console.error('Failed to reset password', error)
    }
}
</script>

<template>
    <div class="flex justify-center">
        <div v-if="!emailSent" class="mt-8 rounded border-2">
            <h2 class="bg-slate-800 text-center text-2xl py-2 p-8">Masukan Email Akun Anda</h2>
            <form class="flex flex-col gap-4 p-8 first-letter:" @submit.prevent="resetPassword">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Email</span>
                    </label>
                    <input
                        v-model="email"
                        type="email"
                        placeholder="Masukan Email Anda"
                        class="input input-bordered input-primary w-full max-w-xs"
                    />
                </div>
                <button type="submit" class="btn btn-primary text-white">Reset Password</button>
            </form>
        </div>
        <div v-if="emailSent" class="mt-8 rounded border-2 p-8">
            <p>Link verifikasi sudah dikirim ke email Anda, ikuti perintah dari email tersebut</p>
        </div>
    </div>
</template>