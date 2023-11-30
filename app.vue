<script setup>
useHead({
    script: [
        {
            src: "//cdn.loop11.com/embed.js",
            async: true,
            type: "text/javascript",
            body: true,
        },
    ],
});
</script>

<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
