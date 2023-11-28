<script setup>
import { userRegister } from "@/utils/user/userRegsiter";
import { googleAuth } from "@/utils/user/googleAuth";
import { checkPasswordSecurity } from "@/utils/user/checkPasswordSecurity";
import { useToast } from "vue-toastification";

useHead({
    title: "Daftar",
});

const toast = useToast();

const email = ref("");
const password = ref("");
const username = ref("");

// TODO: [BREAKING] ganti email verification callback route ke production domain
async function handleRegister() {
    if (
        passwordSecurity.value.hasMinLength &&
        passwordSecurity.value.hasUpperCase &&
        passwordSecurity.value.hasLowerCase &&
        passwordSecurity.value.hasNumber &&
        passwordSecurity.value.hasSpecialChar
    ) {
        try {
            await userRegister(email.value, password.value, username.value);
            navigateTo("/auth/email-verification");
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;

            switch (errorCode) {
                case "auth/email-already-in-use":
                    toast.error("Email sudah digunakan");
                    break;
                case "auth/invalid-email":
                    toast.error("Email tidak valid");
                    break;
                case "auth/operation-not-allowed":
                    toast.error("Operasi tidak diperbolehkan");
                    break;
                case "auth/weak-password":
                    toast.error("Weak password.");
                    break;
                default:
                    toast.error(errorMessage);
                    break;
            }
        }
    } else {
        toast.error("Password tidak memenuhi syarat keamanan");
    }
}

async function handleGoogleAuth() {
    try {
        await googleAuth();
        console.log("Google Auth Success");
        await navigateTo("/dashboard");
    } catch (error) {
        console.error("Authentication failed:", error);
    }
}

// Password Security
const passwordSecurity = ref({});
const isPasswordSecure = ref(false);

watch(password, (newPassword) => {
    passwordSecurity.value = checkPasswordSecurity(newPassword);
    isPasswordSecure.value = Object.values(passwordSecurity.value).every((value) => value === true);
});

// Password security message visibility
const passwordFocused = ref(false);

function handlePasswordFocus() {
    passwordFocused.value = true;
}

// Password visiblity toggle
const showPassword = ref(false);

function toggleShowPassword() {
    showPassword.value = !showPassword.value;
}

// Username validation
const usernameBlured = ref(false);
const usernameValidated = computed(() => username.value.length >= 3);

function handleUsernameBlur() {
    usernameBlured.value = true;
}

// Email validation
const emailFocused = ref(false);
const emailBlurred = ref(false);

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
const isEmailValid = computed(() => emailRegex.test(email.value));

function handleEmailFocus() {
    emailFocused.value = true;
}

function handleEmailBlur() {
    emailBlurred.value = true;
}
</script>

<template>
    <div class="flex justify-center items-center bg-background p-8">
        <div class="max-w-sm flex flex-col gap-4">
            <div class="border border-second rounded">
                <h2 class="bg-slate-800 text-center text-2xl py-2">Daftar Akun Baru</h2>
                <div class="flex flex-col px-8 py-6 gap-3">
                    <form @submit.prevent="handleRegister()" class="flex flex-col gap-2">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Username</span>
                            </label>
                            <input required @blur="handleUsernameBlur" v-model="username" type="text" placeholder="Username" class="input input-bordered input-primary w-full max-w-xs" />
                            <div v-if="usernameBlured">
                                <label v-if="!usernameValidated" class="label">
                                    <span class="label-text-alt text-md text-red-500">Minimal 3 Karakter</span>
                                </label>
                            </div>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Email</span>
                            </label>
                            <input
                                required
                                @focus="handleEmailFocus"
                                @blur="handleEmailBlur"
                                v-model="email"
                                type="email"
                                placeholder="Masukan Email Anda"
                                class="input input-bordered input-primary w-full max-w-xs"
                            />
                            <div v-if="emailBlurred">
                                <label v-if="!isEmailValid" class="label">
                                    <span class="label-text-alt text-md text-red-500">Masukkan Email yang Valid</span>
                                </label>
                            </div>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Password</span>
                            </label>
                            <div class="relative">
                                <input
                                    required
                                    @focus="handlePasswordFocus"
                                    v-model="password"
                                    :type="showPassword ? 'text' : 'password'"
                                    placeholder="Kata Sandi"
                                    class="input input-bordered input-primary w-full max-w-xs"
                                />
                                <button @click.prevent="toggleShowPassword" class="absolute right-0 top-0 mt-3 mr-3">
                                    <Icon :name="showPassword ? 'ph:eye-slash' : 'ph:eye'" />
                                </button>
                            </div>
                        </div>
                        <!-- $ password validation messages -->
                        <div v-if="passwordFocused" class="flex flex-col gap-1 border border-slate-700 rounded p-2">
                            <span class="text-md">Password Anda harus mengandung:</span>
                            <div :class="{ 'text-green-500': passwordSecurity.hasMinLength, 'text-red-500': !passwordSecurity.hasMinLength }">
                                <Icon :name="passwordSecurity.hasMinLength ? 'ph:check-circle' : 'ph:x-circle'" />
                                Minimal 8 karakter
                            </div>
                            <div :class="{ 'text-green-500': passwordSecurity.hasUpperCase, 'text-red-500': !passwordSecurity.hasUpperCase }">
                                <Icon :name="passwordSecurity.hasUpperCase ? 'ph:check-circle' : 'ph:x-circle'" />
                                Huruf besar
                            </div>
                            <div :class="{ 'text-green-500': passwordSecurity.hasLowerCase, 'text-red-500': !passwordSecurity.hasLowerCase }">
                                <Icon :name="passwordSecurity.hasLowerCase ? 'ph:check-circle' : 'ph:x-circle'" />
                                Huruf kecil
                            </div>
                            <div :class="{ 'text-green-500': passwordSecurity.hasNumber, 'text-red-500': !passwordSecurity.hasNumber }">
                                <Icon :name="passwordSecurity.hasNumber ? 'ph:check-circle' : 'ph:x-circle'" />
                                Angka
                            </div>
                            <div :class="{ 'text-green-500': passwordSecurity.hasSpecialChar, 'text-red-500': !passwordSecurity.hasSpecialChar }">
                                <Icon :name="passwordSecurity.hasSpecialChar ? 'ph:check-circle' : 'ph:x-circle'" />
                                Karakter spesial (!, @, #, $, %, ^, &, *)
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary text-white" :class="{ 'btn-disabled': !isPasswordSecure || !isEmailValid || !usernameValidated }">Daftar</button>
                    </form>
                    <div class="divider">Atau Daftar Menggunakan</div>
                    <div class="flex flex-col gap-1">
                        <button @click="handleGoogleAuth" class="btn btn-outline btn-secondary">
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