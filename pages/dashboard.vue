<script setup>
import { useToast } from "vue-toastification";
import { changeName } from "@/utils/user/changeName";
import { getProgressDashboard } from "~/utils/progress/getProgressDashboard";
import { uploadProfilePicture } from "@/utils/user/uploadProfilePicture";
import { createReview } from "@/utils/course-review/createReview";
import { readOneReview } from "@/utils/course-review/readOneReview";
import { editReview } from "@/utils/course-review/editReview";
import { deleteReview } from "@/utils/course-review/deleteReview";
import { getRecommendedCourses } from "@/utils/content/getRecommendedCourses";
import { getLatestUserProgress } from "@/utils/progress/getLatestUserProgress";

const toast = useToast();
const currentUser = useCurrentUser();
const router = useRouter();
const activeTab = ref("kursusku");

definePageMeta({
    layout: "nofooter"
})

onMounted(() => {
    const { query } = router.currentRoute.value;
    if (query.tab === "kelola-akun") {
        activeTab.value = "akunku";
    }
});

// Get users progress
const usersProgress = ref(null);
async function handleGetUsersProgress() {
    usersProgress.value = await getProgressDashboard(currentUser.value.uid);
    if (!usersProgress.value) {
        console.log("users progress is falsy");
    } else {
        console.log("users progress is truthy");
    }
}

const newName = ref(null);
async function handleChangeName() {
    await changeName(newName.value, currentUser.value.displayName);
}

if (currentUser.value) {
    await handleGetUsersProgress();
    newName.value = currentUser.value.displayName;
}

watch(currentUser, async (newValue, oldValue) => {
    console.log("user updated from watch()");
    await handleGetUsersProgress();
    newName.value = currentUser.value.displayName;
});

// Get Recommended Courses
const recommendedCourses = await getRecommendedCourses();

const newProfilePictureImage = ref(null);
const newProfilePictureImageUrl = ref(null);

async function handleUploadProfilePicture() {
    await uploadProfilePicture(newProfilePictureImage.value, currentUser.value);
    closeModal();
}

function handleFileChange(event) {
    newProfilePictureImage.value = event.target.files[0];
    openProfilePictureModal.value = true;

    if (newProfilePictureImage.value) {
        const reader = new FileReader();
        reader.onload = (e) => {
            newProfilePictureImageUrl.value = e.target.result;
        };
        reader.readAsDataURL(newProfilePictureImage.value);
    }
}

const openProfilePictureModal = ref(false);

function closeModal() {
    openProfilePictureModal.value = false;
    newProfilePictureImage.value = null;
    newProfilePictureImageUrl.value = null;
}

// Create Review
const rating = ref(5);
const review = ref("");
const closeReviewDialog = ref(null);

async function handleCreateReview(courseId) {
    console.log("Rating", rating.value);
    console.log("Review", review.value);
    await createReview(currentUser.value, review.value, rating.value, courseId);
    toast.success("Berhasil menambah review", {
        timeout: 2000,
    });
}

// Read Review
const reviewPreview = ref(null);
async function handleGetReview(courseId) {
    console.log("getting users review");
    reviewPreview.value = await readOneReview(courseId, currentUser.value.uid);
}

// Edit Review
const editReviewMode = ref(false);
const newReviewContent = ref("");
function openEditReview() {
    editReviewMode.value = true;
    newReviewContent.value = reviewPreview.value.content;
}

async function handleEditReview(reviewId) {
    await editReview(reviewId, newReviewContent.value, reviewPreview.value.rating);
}

// Delete Review
async function handleDeleteReview(reviewId) {
    await deleteReview(reviewId);
    closeReviewDialog.value.$el.click();
    toast.success("Berhasil menghapus review", {
        timeout: 2000,
    });
}

// Navigate user to the latest progress
async function handleNavigateUserToTheLatestProgress(courseId, courseSlug) {
    const kontenTerakhir = await getLatestUserProgress(currentUser.value.uid, courseId);
    console.log(courseSlug);
    navigateTo(`/${courseSlug}/${kontenTerakhir.slug.current}`);
}
</script>

<template>
    <div>
        <div class="bg-[#191825] py-8 flex flex-col gap-6 h-full con">
            <div class="tabs">
                <button class="btn btn-ghost tab" :class="{ 'tab-active, text-primary': activeTab === 'kursusku' }" @click="activeTab = 'kursusku'">Kursusku</button>
                <div class="divider divider-horizontal"></div>
                <button class="btn btn-ghost tab" :class="{ 'tab-active, text-primary': activeTab === 'akunku' }" @click="activeTab = 'akunku'">Akunku</button>
            </div>
            <!-- Kursusku -->
            <div v-show="activeTab === 'kursusku'" class="flex flex-col gap-3">
                <div class="mb-4">
                    <p v-if="currentUser" class="text-5xl">👋 Selamat Datang {{ currentUser.displayName }}</p>
                </div>

                <h2 class="text-2xl font-medium">Kemajuan Belajar</h2>
                <div class="flex flex-col gap-3">
                    <div v-if="!usersProgress" class="border rounded border-gray-600 px-6 py-4">
                        <p class="text-2xl">Anda belum memulai kursus</p>
                    </div>
                    <div v-else class="flex justify-between items-center border rounded border-gray-600 px-6 py-4">
                        <template v-for="progress in usersProgress" :key="progress._id">
                            <div class="flex gap-4">
                                <div class="radial-progress" :style="`--value: ${progress.completionPercentage}; --thickness: .6rem;`">{{ progress.completionPercentage }}%</div>
                                <div class="flex flex-col">
                                    <NuxtLink :to="`/${progress.slug.current}`" class="text-2xl font-bold">{{ progress.title }}</NuxtLink>
                                    <p>Artikel {{ progress.finishedArticle }}/{{ progress.postCount }}</p>
                                    <p>Latihan {{ progress.finishedExercise }}/{{ progress.exerciseCount }}</p>
                                </div>
                            </div>
                            <div>
                                <!-- TODO: UI: ganti tombol todo menjadi mengikuti best practice ux -->
                                <button @click="handleGetReview(progress._id)" onclick="my_modal_1.showModal()" class="bg-secondary px-10 py-1 rounded-sm text-background font-medium text-sm mr-2">Beri Ulasan</button>
                                <dialog id="my_modal_1" class="modal text-slate-100">
                                    <form method="dialog" class="modal-box w-3/6" @submit.prevent>
                                        <div class="flex flex-col gap-4" v-if="!reviewPreview">
                                            <h2 class="text-2xl font bold">Beri Ulasan</h2>
                                            <p class="text-lg font-bold">{{ progress.title }}</p>
                                            <div class="form-control">
                                                <label class="label">
                                                    <span class="label-text">Bagaimana kualitas dari kursus ini?</span>
                                                </label>
                                                <div class="rating">
                                                    <input type="radio" value="1" v-model="rating" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                                    <input type="radio" value="2" v-model="rating" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                                    <input type="radio" value="3" v-model="rating" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                                    <input type="radio" value="4" v-model="rating" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                                    <input type="radio" value="5" v-model="rating" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                                </div>
                                            </div>
                                            <div class="form-control">
                                                <label class="label">
                                                    <span class="label-text">Beri Ulasan untuk kursus ini</span>
                                                </label>
                                                <textarea v-model="review" class="textarea textarea-bordered" placeholder="Review"></textarea>
                                            </div>
                                            <button @click="handleCreateReview(progress._id)" class="btn btn-primary">Kirim</button>
                                        </div>
                                        <!-- TODO: UI: Posisikan card agak diatas -->
                                        <div v-if="reviewPreview" class="w-full">
                                            <h2 class="text-xl font-bold mb-4">Ulasan Anda</h2>
                                            <div class="flex justify-between items-start w-full">
                                                <div class="flex gap-3 items-center">
                                                    <div class="avatar">
                                                        <div class="w-12 rounded-full">
                                                            <img :src="reviewPreview.photoUrl" alt="profile-picture" />
                                                        </div>
                                                    </div>

                                                    <div class="relative">
                                                        <div v-if="!editReviewMode" class="absolute w-full h-full top-0 left-0 z-10" />
                                                        <div class="flex flex-col">
                                                            <span class="text-lg">{{ reviewPreview.username }}</span>
                                                            <div class="rating">
                                                                <input type="radio" v-model="reviewPreview.rating" value="1" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                                                <input type="radio" v-model="reviewPreview.rating" value="2" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                                                <input type="radio" v-model="reviewPreview.rating" value="3" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                                                <input type="radio" v-model="reviewPreview.rating" value="4" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                                                <input type="radio" v-model="reviewPreview.rating" value="5" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="flex gap-2 items-center">
                                                    <!-- TODO: BUG: if user enter edit mode, then change rating, then comeback to preview mode the rating will preserve. the rating should go back to the value before user enter edit mode -->
                                                    <!-- TODO: UI: button tidak berganti warna ketika di hover -->
                                                    <!-- TODO: UI: taruh button di pojok kanan atas card -->
                                                    <button @click="openEditReview()" class="btn btn-ghost btn-sm">
                                                        <Icon name="mdi:lead-pencil"></Icon>
                                                    </button>
                                                    <button @click="handleDeleteReview(reviewPreview.id)" class="btn btn-ghost btn-sm">
                                                        <Icon name="mdi:trash-can-outline"></Icon>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="mt-2">
                                                <p v-if="!editReviewMode">{{ reviewPreview.content }}</p>
                                                <div v-else>
                                                    <textarea class="textarea textarea-bordered w-full" v-model="newReviewContent"></textarea>
                                                    <div class="flex gap-2 mt-3">
                                                        <button @click="editReviewMode = false" class="btn">Cancel</button>
                                                        <button @click="handleEditReview(reviewPreview.id)" class="btn btn-primary">Kirim</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <form method="dialog" class="modal-backdrop">
                                        <button ref="closeReviewDialog">close</button>
                                    </form>
                                </dialog>
                                <button @click="handleNavigateUserToTheLatestProgress(progress._id, progress.slug.current)" class="bg-primary px-10 py-1 rounded-sm text-background font-medium text-sm">Lanjut belajar</button>
                            </div>
                        </template>
                    </div>
                </div>
                <h2 class="text-2xl font-medium">Rekomendasi Kursus</h2>
                <div class="grid grid-cols-3 gap-4">
                    <template v-for="course in recommendedCourses" :key="course._id">
                        <NuxtLink :to="`/${course.slug.current}`">
                            <div class="card card-compact bg-slate-900 hover:bg-slate-800 shadow-xl">
                                <figure><img :src="course.mainImage" alt="Shoes" class="w-full h-56 bg-cover" /></figure>
                                <div class="card-body">
                                    <h2 class="card-title">{{ course.title }}</h2>
                                    <p class="text-lg">{{ course.shortDescription }}</p>
                                </div>
                            </div>
                        </NuxtLink>
                    </template>
                </div>
            </div>
            <div v-show="activeTab === 'akunku'">
                <div class="flex gap-10" v-if="currentUser">
                    <div class="w-64 h-52 rounded-full relative">
                        <img :src="currentUser.photoURL" alt="profile-pic" class="rounded-full w-full h-full" />
                        <div class="dropdown dropdown-end absolute bottom-0 right-0 mb-2 mr-2">
                            <label tabindex="0" class="btn btn-ghost btn-circle btn-sm hover:bg-slate-700">
                                <Icon name="mdi:lead-pencil" size="1.5em"></Icon>
                            </label>
                            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <div class="relative">
                                        <button>Unggah Foto</button>
                                        <input @change="handleFileChange" type="file" class="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer" />
                                    </div>
                                </li>
                                <!-- TODO: FUNC: Integrasi fitur hapus akun -->
                                <li><a>Hapus Foto</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="w-full flex flex-col gap-4">
                        <div class="flex flex-col gap-1">
                            <!-- TODO: UI: standardisasi ui menggunakan daisyui -->
                            <!-- TODO: FUNC: ganti kata sandi -->
                            <p>Nama:</p>
                            <div class="flex border border-second rounded-lg pl-4">
                                <input v-model="newName" type="text" class="w-full bg-inherit" />
                                <button @click="handleChangeName()" class="min-w-fit border-l border-l-second py-2 px-2">Ubah nama</button>
                            </div>
                            <p class="text-xs">Ini adalah nama yang akan dilihat user lain</p>
                        </div>
                        <div class="flex flex-col gap-1">
                            <p>Email:</p>
                            <div class="flex border border-second rounded-lg pl-4">
                                <p class="py-2">{{ currentUser.email }}</p>
                            </div>
                            <p class="text-xs">Kamu tidak dapat mengubah surel yang digunakan</p>
                        </div>
                        <div class="flex flex-col gap-1">
                            <p>Kata sandi:</p>
                            <div class="flex border border-second rounded-lg pl-4">
                                <input type="password" name="" id="" class="w-full bg-inherit" value="******" />
                                <button class="min-w-fit border-l border-l-second py-2 px-2">Ubah kata sandi</button>
                            </div>
                            <p class="text-xs">Anda hanya dapat mengubah kata sandi anda tiap 2 hari</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TODO: FUNC: add crop image functionality -->
            <!-- TODO: FUNC: image size validation -->
            <!-- TODO: FUNC: image format validation -->
            <!-- Modal -->
            <div v-if="openProfilePictureModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <!-- Background overlay, show/hide based on modal state -->
                    <div class="fixed inset-0 bg-base-100 bg-opacity-75 transition-opacity" @click="closeModal"></div>

                    <!-- Modal content -->
                    <div class="inline-block align-bottom bg-base-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div class="bg-slate-600 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 class="text-lg leading-6 font-medium text-white" id="modal-title">Preview of Uploaded Picture</h3>
                                    <div class="mt-2">
                                        <img :src="newProfilePictureImageUrl" v-if="newProfilePictureImageUrl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" @click="handleUploadProfilePicture" class="btn btn-primary btn-md text-white ml-2">Upload</button>
                            <button type="button" @click="closeModal" class="btn btn-md">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- <pre>
                User Data
                {{ currentUser }}

                Users progres 
                {{ usersProgress }}
            </pre> -->
        </div>
    </div>
</template>