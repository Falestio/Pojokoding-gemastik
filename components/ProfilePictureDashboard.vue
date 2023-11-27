<template>
    <div>
        <!--$ Avatar, tombol unggah foto, dan tombol hapus foto -->
        <div class="w-64 h-64 relative">
            <!--$ Avatar -->
            <div class="avatar w-full rounded-full overflow-hidden">
                <img v-if="currentUser" :src="currentUser.photoURL" class="w-full h-auto object-cover" />
            </div>
            <!-- $ Dropdown - Unggah Foto dan hapus foto -->
            <div class="dropdown dropdown-end absolute bottom-0 right-0">
                <!-- $ Tombol pensil untuk membuka dropdown button -->
                <label tabindex="0" class="btn btn-ghost btn-circle btn-sm hover:bg-slate-700">
                    <Icon name="mdi:lead-pencil" size="1.5em"></Icon>
                </label>
                <!-- $ Dropdown Content -->
                <ul tabindex="0" class="dropdown-content menu bg-base-100 w-52 text-lg">
                    <!--$ Tombol Unggah Foto -->
                    <li class="hover:bg-slate-800">
                        <div class="relative">
                            <button>Unggah Foto</button>
                            <input ref="input" type="file" name="image" accept="image/*" @change="setImage" class="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                    </li>
                    <!-- $ Tombol Hapus Foto -->
                    <li class="hover:bg-slate-800" v-if="!isDicebearURL">
                        <button @click="deleteImageAndReplace()">Hapus Foto</button>
                    </li>
                </ul>
            </div>
        </div>

        <!--$ Modal -->
        <div v-if="isOpen" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-center justify-center min-h-screen">
                <!-- $ Modal Box -->
                <div class="modal-content bg-slate-800 rounded-lg transform transition-all sm:max-w-lg sm:w-full relative">
                    <!-- $ Close Modal Button -->
                    <div class="absolute top-2 right-2">
                        <button @click="closeModal" type="button" class="btn btn-ghost text-xl">X</button>
                    </div>

                    <!-- $ Modal Content -->
                    <div class="p-3 pt-4">
                        <!-- $ Title -->
                        <h2 class="text-xl mb-4">Crop Image</h2>
                        <!-- $ Cropper -->
                        <div>
                            <cropper class="cropper" ref="cropperRef" :src="img" @change="change" :stencil-component="CircleStencil"></cropper>
                        </div>
                        <!-- $ Upload Image Button -->
                        <button @click="uploadImage()" class="btn btn-prmary">Upload Image</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { CircleStencil, Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { useToast } from "vue-toastification";
import { uploadProfilePicture } from "@/utils/user/uploadProfilePicture";
import { deleteProfilePictureAndReplace } from "@/utils/user/deleteProfilePictureAndReplace";

const toast = useToast();
const currentUser = useCurrentUser();
// user upload pictures -> validation -> open modal -> user crop image -> get cropped image -> upload cropped image
const img = ref(
    "https://images.unsplash.com/photo-1572800578930-fd1013b506c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvbGFyJTIwYmVhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
);

// MODAL UI
const isOpen = ref(false);

const closeModal = () => {
    isOpen.value = false;
};

const openModal = () => {
    isOpen.value = true;
};

// GET USERS IMAGE

// MANAGE CROPPER AND UPLOAD IMAGE
const cropperRef = ref(null);

function setImage(e) {
    const file = e.target.files[0];

    // Validation
    if (!imageValidation(file)) {
        return;
    }

    if (file) {
        // Create a URL for the uploaded image
        img.value = URL.createObjectURL(file);
        openModal();
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

async function uploadImage() {
    const { canvas } = cropperRef.value.getResult();
    if (canvas) {
        canvas.toBlob(async (blob) => {
            await uploadProfilePicture(blob, currentUser.value);
        }, "image/jpeg");

        closeModal();
    }
}

async function deleteImageAndReplace() {
    await deleteProfilePictureAndReplace(currentUser.value);
}

const isDicebearURL = computed(() => {
    return currentUser.value?.photoURL?.includes("api.dicebear.com") ?? false;
});
</script>

<style>
.modal-content {
    transition: opacity 0.3s ease, transform 0.3s ease;
    opacity: 0;
    transform: scale(0.95);
    animation: modalFadeIn 0.3s forwards;
}

@keyframes modalFadeIn {
    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>