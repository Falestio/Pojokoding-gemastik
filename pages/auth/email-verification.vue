<script setup>
import { resendEmailVerification } from '@/utils/user/resendEmailVerification';

const emailSent = ref(false)

async function handleResendEmailVerification() {
    await resendEmailVerification()
    emailSent.value = true
}
</script>

<template>
    <div class="flex justify-center">
        <div class="mt-8 p-8 rounded border-2">
            <h1 class="text-2xl mb-4">Verifikasi Email Anda</h1>
            <p class="mb-4">Kami telah mengirim link verifikasi ke email yang anda masukan, Klik link tersebut</p>
            <button @click="handleResendEmailVerification" class="btn btn-primary">Belum Menerima Email</button>
            <p v-if="emailSent">Email sudah dikirim</p>
        </div>
    </div>
</template>