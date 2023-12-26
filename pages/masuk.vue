<script setup>
import { userLogin } from "@/utils/user/userLogin";
import { useToast } from "vue-toastification";

// TODO: Jika user sudah login, halangi dari halaman login 
useHead({
    title: "Masuk",
});

const toast = useToast();

const email = ref("");
const password = ref("");
const loginLoading = ref(false);

const isFormValid = computed(() => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return email.value.match(emailRegex) && password.value;
});

async function handleUserLogin() {
    loginLoading.value = true;
    if (isFormValid) {
        try {
            const loggedIn = await userLogin(email.value, password.value);
            if (loggedIn) {
                navigateTo("/dashboard");
            }
            loginLoading.value = false;
        } catch (error) {
            switch (error.code) {
                case "auth/invalid-email":
                    toast.error("Email tidak valid", { timeout: 4000 });
                    break;
                case "auth/user-disabled":
                    toast.error("User sudah dinonaktifkan oleh administrator", { timeout: 4000 });
                    break;
                case "auth/user-not-found":
                    toast.error("User tidak ditemukan", { timeout: 4000 });
                    break;
                case "auth/wrong-password":
                    toast.error("Password salah", { timeout: 4000 });
                    break;
                default:
                    toast.error("Unknown error occured", { timeout: 4000 });
                    break;
            }
            loginLoading.value = false;
        }
    }
}
</script>

<template>
    <div class="flex justify-center items-center h-screen bg-background">
        <div class="max-w-sm flex flex-col gap-4">
            <div class="border border-second rounded">
                <h2 class="bg-slate-800 text-center text-2xl py-2">Masuk ke akun Anda</h2>
                <div class="flex flex-col px-8 py-6 gap-3">
                    <!-- TODO: masuk mengguankan google -->
                    <!-- TODO: tombol google di redesign ke design resmi -->
                    <!-- TODO: tombol design tetep tapi disable -->
                    <form @submit.prevent="handleUserLogin()" class="flex flex-col gap-2">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Email</span>
                            </label>
                            <input data-cy="masuk-form-email" v-model="email" type="email" placeholder="Masukan Email Anda" class="input input-bordered input-primary w-full max-w-xs" />
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Password</span>
                            </label>
                            <input data-cy="masuk-form-password" v-model="password" type="password" placeholder="Kata Sandi" class="input input-bordered input-primary w-full max-w-xs" />
                        </div>
                        <div class="text-right">
                            <NuxtLink to="/auth/reset-password" class="hover:underline">Lupa password?</NuxtLink>
                        </div>
                        <button data-cy="masuk-submit" v-if="!loginLoading" :disabled="!isFormValid" type="submit" class="btn btn-primary text-white">Masuk</button>
                        <button v-if="loginLoading" class="btn btn-primary"><span class="loading loading-bars loading-md text-white"></span></button>
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