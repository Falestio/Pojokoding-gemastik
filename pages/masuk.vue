<script setup>
// TODO: FUNC : Sama seperti daftar
import { userLogin } from '@/utils/user/userLogin' 

const email = ref('')
const password = ref('')

async function handleUserLogin(){
    await userLogin(email.value, password.value)
    navigateTo('/dashboard')
}
// TODO: FUNC : lupa password

</script>

<template>
    <div class="flex justify-center items-center h-screen bg-background">
        <div class="w-3/12 flex flex-col gap-4">
            <div class="border border-second rounded">
                <h2 class="bg-slate-800 text-center text-2xl py-2">Masuk ke akun Anda</h2>
                <div class="flex flex-col px-8 py-6 gap-3">
                    <form @submit.prevent="handleUserLogin()" class="flex flex-col gap-2">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Email</span>
                            </label>
                            <input v-model="email" type="email" placeholder="Masukan Email Anda" class="input input-bordered input-primary w-full max-w-xs" />
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Password</span>
                            </label>
                            <input v-model="password" type="password" placeholder="Kata Sandi" class="input input-bordered input-primary w-full max-w-xs" />
                        </div>
                        <button type="submit" class="btn btn-primary text-white">Masuk</button>
                    </form>
                    <div class="divider">Atau Login Menggunakan</div>
                    <div class="flex flex-col gap-1">
                        <button class="btn btn-outline btn-secondary">
                            <span class="text-white">Google</span>
                        </button>
                        <p class="text-sm">Dengan masuk ke PojoKoding, kamu menyetujui <span class="text-second">ketentuan</span> yang kami tetapkan</p>
                    </div>
                </div>
            </div>
            <div class="border border-second flex flex-col gap-1 px-8 pt-1.5 pb-3">
                <p class="text-sm">Belum punya akun?</p>
                <NuxtLink to="/daftar" class="btn btn-outline btn-secondary">
                    <span class="text-white">Daftar</span>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>