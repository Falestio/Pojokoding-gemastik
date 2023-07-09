<script setup>
import { userRegister } from '@/utils/user/userRegsiter';

// TODO: FUNC : form validation
// TODO: FUNC : captcha security
// TODO: FUNC : pemberitahuan email sudah digunakan
// TODO: FUNC : Google auth
// TODO: FUNC : kebijakan privasi dan syarat ketentuan
const email = ref('')

// TODO: FUNC : Konfirmasi password
const password = ref('')
const username = ref('')

async function handleRegister(){
    await userRegister(email.value, password.value, username.value)
    navigateTo("/dashboard")
}
</script>

<template>
    <div class="flex justify-center items-center h-screen bg-background">
        <div class="w-3/12 flex flex-col gap-4">
            <div class="border border-second rounded">
                <h2 class="bg-slate-800 text-center text-2xl py-2">Daftar Akun Baru</h2>
                <div class="flex flex-col px-8 py-6 gap-3">
                    <form @submit.prevent="handleRegister()" class="flex flex-col gap-2">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Username</span>
                            </label>
                            <input v-model="username" type="text" placeholder="Username" class="input input-bordered input-primary w-full max-w-xs" />
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Email</span>
                            </label>
                            <input v-model="email" type="email" placeholder="Masukan Email Anda" class="input input-bordered input-primary w-full max-w-xs" />
                        </div>
                        <!-- TODO: UI : membuat kata sandi visible toggle -->
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Password</span>
                            </label>
                            <input v-model="password" type="password" placeholder="Kata Sandi" class="input input-bordered input-primary w-full max-w-xs" />
                        </div>
                        <button type="submit" class="btn btn-primary text-white">Daftar</button>
                    </form>
                    <div class="divider">Atau Daftar Menggunakan</div>
                    <div class="flex flex-col gap-1">
                        <button class="btn btn-outline btn-secondary">
                            <span class="text-white">Google</span>
                        </button>
                        <p class="text-sm">Dengan membuat akun PojoKoding, kamu menyetujui <span class="text-second">ketentuan</span> yang kami tetapkan</p>
                    </div>
                </div>
            </div>
            <div class="border border-second flex flex-col gap-1 px-8 pt-1.5 pb-3">
                <p class="text-sm">Sudah punya akun?</p>
                <NuxtLink to="/masuk" class="btn btn-outline btn-secondary">
                    <span class="text-white">Masuk</span>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>