// https://nuxt.com/docs/api/configuration/nuxt-config
const allFilesInsideFolder = (path: string) => {
    const fs = require('fs')
    const files = fs.readdirSync(path)
    return files.map((i: any) => path + i)
}

export default defineNuxtConfig({
    modules: ["@nuxtjs/tailwindcss", "@nuxtjs/sanity", "nuxt-icon", '@tailvue/nuxt',],

    css: allFilesInsideFolder("assets/css/"),

    build:{
        // vue-toastification - old commonjs module 
        transpile: ['vue-toastification'],
    },

    sanity: {
        projectId: "diimhezu",
        apiVersion: "2021-10-21",
        dataset: "prod",
        useCdn: false,
    },
});
