// https://nuxt.com/docs/api/configuration/nuxt-config
const allFilesInsideFolder = (path: string) => {
    const fs = require('fs')
    const files = fs.readdirSync(path)
    return files.map((i: any) => path + i)
}

export default defineNuxtConfig({
    modules: ["@nuxtjs/tailwindcss", "@nuxtjs/sanity", "nuxt-icon"],

    css: allFilesInsideFolder("assets/css/"),

    sanity: {
        projectId: "diimhezu",
        apiVersion: "2021-10-21",
        dataset: "prod",
        useCdn: false,
    },
});
