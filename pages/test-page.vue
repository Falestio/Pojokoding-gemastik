<template>
    <div>
        <button @click="toastTest()">show toast</button>
    </div>
</template>

<script setup>
import { useToast } from "vue-toastification";
const toast = useToast();

const toastTest = async () => {
    toast.success("My toast content", {
        timeout: 2000,
    });
};
</script>