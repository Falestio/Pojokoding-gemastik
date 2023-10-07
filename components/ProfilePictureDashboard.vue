<template>
    <div>
        <div class="avatar">
            <div class="w-24 rounded-full">
                <img :src="img" />
            </div>
        </div>

        <button class="btn" onclick="uploadProfilePictureModal.showModal()">open modal</button>
        <dialog id="uploadProfilePictureModal" class="modal">
            <div class="modal-box">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 class="font-bold text-lg">Hello!</h3>
                <p class="py-4">Press ESC key or click on ✕ button to close</p>
            </div>
        </dialog>

        <div class="relative p-3">
            <button class="btn btn-primary" @click="showFileChooser">Unggah Foto</button>
            <input ref="input" type="file" name="image" accept="image/*" @change="setImage" class="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
        <div>
            <cropper class="cropper" :src="img" @change="change"></cropper>
        </div>
    </div>
</template>

<script setup>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { useToast } from "vue-toastification";

const toast = useToast();
// user upload pictures -> validation -> open modal -> user crop image -> get cropped image -> upload cropped image

const img = ref("https://images.unsplash.com/photo-1572800578930-fd1013b506c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvbGFyJTIwYmVhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60");

function setImage(e) {
    const file = e.target.files[0];

    // validation
    if (!imageValidation(file)) {
        return;
    }

    if (file) {
        // Create a URL for the uploaded image
        img.value = URL.createObjectURL(file);
    }
}

function change({ coordinates, canvas }) {
    console.log(coordinates, canvas);
}

function imageValidation(file) {
    // validation
    const acceptedImageTypes = ["image/jpeg", "image/png"];

    console.log(file.size);
    console.log(file.type);

    const isImageSizeVerified = file.size < 10 * 1024 * 1024;
    const isImageTypeVerified = acceptedImageTypes.includes(file.type);

    if (!isImageSizeVerified) {
        toast.error("Ukuran gambar tidak boleh lebih dari 10MB", {
            timeout: 2000,
        });
        return false;
    }

    if (!isImageTypeVerified) {
        toast.error("Format gambar tidak didukung", {
            timeout: 2000,
        });
        return false;
    }

    return true;
}
</script>