<template>
    <header class="flex items-center justify-between px-4 py-2 bg-[#191825] border-b border-gray-700 text-white sm:px-8">
        <NuxtLink to="/" class="text-2xl sm:text-3xl font-bold text-primary drop-shadow-md">Pojokoding</NuxtLink>
        <div class="hidden sm:flex items-center gap-6">
            <div class="flex">
                <!-- <NuxtLink to="/kontak" class="px-4 btn btn-ghost">Hubungi Kami</NuxtLink> -->
                <NuxtLink to="/katalog-kursus" class="px-4 btn btn-ghost">Katalog Kursus</NuxtLink>
                <NuxtLink to="/dashboard" class="px-4 btn btn-ghost">Dashboard</NuxtLink>
            </div>
            <div class="h-6 w-px bg-[#E384FF]"></div>
            <div v-if="currentUser" class="flex items-center gap-2">
                <div class="dropdown dropdown-end">
                    <label tabindex="0" class="m-1">
                        <img :src="currentUser.photoURL" alt="Profile Picture" class="h-8 w-8 rounded-full" />
                    </label>
                    <ul tabindex="0" class="flex flex-col gap-4 dropdown-content z-[1] menu p-4 shadow bg-slate-800 rounded-box w-52">
                      <NuxtLink to="/dashboard?tab=kelola-akun" class="btn">Kelola Akun</NuxtLink>  
                      <button @click="handleLogout" class="btn">Logout</button>
                    </ul>
                </div>
            </div>
            <div v-else class="flex items-center gap-2">
                <NuxtLink to="/masuk" class="px-4 btn btn-ghost">Masuk</NuxtLink>
                <NuxtLink to="/daftar" class="btn btn-primary">Daftar</NuxtLink>
            </div>
        </div>
        <div class="flex sm:hidden">
            <!-- Burger menu for smaller screen -->
            <button @click="showMenu = !showMenu">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-white">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
            </button>
        </div>
    </header>
    <!-- Dropdown Menu -->
    <div v-if="showMenu" class="bg-white shadow-sm rounded-lg sm:hidden">
        <!-- Navigation items -->
        <!-- Remember to duplicate this for bigger screen if needed -->
    </div>
</template>
  
  <script setup>
import { signOut } from "@firebase/auth";
import { useCurrentUser } from "@/composables/useCurrentUser";
const { $auth } = useNuxtApp();

const showMenu = ref(false); // To handle mobile navigation visibility
const currentUser = await useCurrentUser();

const handleLogout = async () => {
    await signOut($auth);
    navigateTo("/");
};
</script>