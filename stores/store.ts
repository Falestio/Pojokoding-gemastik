import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
    const message = ref('Hello world!')
})