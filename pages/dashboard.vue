<script setup>
import { useToast } from "vue-toastification";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { changeName } from "@/utils/user/changeName";
import { getProgressDashboard } from "~/utils/progress/getProgressDashboard";
import { uploadProfilePicture } from "@/utils/user/uploadProfilePicture";
import { createReview } from "@/utils/course-review/createReview";
import { readOneReview } from "@/utils/course-review/readOneReview";
import { editReview } from "@/utils/course-review/editReview";
import { deleteReview } from "@/utils/course-review/deleteReview";
import { getLatestUserProgress } from "@/utils/progress/getLatestUserProgress";
import { verifyImageSize } from "@/utils/image/verifyImageSize";
// import { verifyImageFormat } from "@/utils/image/verifyImageFormat";
import { deleteAccount } from "@/utils/user/deleteAccount";

const toast = useToast();
const currentUser = useCurrentUser();
const activeTab = ref("kursusku");

definePageMeta({
    layout: "nofooter",
});

useHead({
    title: "Dashboard",
});

onMounted(() => {
    const router = useRouter();
    const { query } = router.currentRoute.value;
    if (query.tab === "kelola-akun") {
        activeTab.value = "akunku";
    }

    if (query.verified) {
        toast.success("Email berhasil diverifikasi", {
            timeout: 2000,
        });
    }
});

const newName = ref(null);
async function handleChangeName() {
    await changeName(newName.value, currentUser.value.displayName);
}

// Get users progress
const usersProgress = ref(null);
const usersProgressLoading = ref(true);
watch(currentUser, async (newValue, oldValue) => {
    const { data } = await useAsyncData(() => getProgressDashboard(currentUser.value.uid));

    usersProgress.value = data.value;
    usersProgressLoading.value = false;

    console.log("PENDING", usersProgressLoading.value);
    console.log("DATA", usersProgress.value);

    newName.value = currentUser.value.displayName;
});

if (currentUser.value) {
    const { data } = await useAsyncData(() => getProgressDashboard(currentUser.value.uid));

    usersProgress.value = data.value;
    usersProgressLoading.value = false;
    console.log("PENDING", usersProgressLoading.value);
    console.log("DATA", usersProgress.value);

    newName.value = currentUser.value.displayName;
}

// Get Recommended Courses
const { pending: recommendedCoursesPending, data: recommendedCourses } = await useLazyFetch("/api/content/get-recommended-courses");

// Create Review
const rating = ref(5);
const review = ref("");
const isModalOpen = ref(false);

async function handleCreateReview(courseId) {
    await createReview(currentUser.value, review.value, rating.value, courseId);
    toast.success("Berhasil menambah review", {
        timeout: 2000,
    });
    await handleGetReview(courseId);
}

// Read Review
// Also change modal status to true
const reviewPreview = ref(null);
const ratingPreview = ref(null);
async function handleGetReview(courseId) {
    reviewPreview.value = await readOneReview(courseId, currentUser.value.uid);

    if (reviewPreview.value) {
        ratingPreview.value = reviewPreview.value.rating;
    }

    // Because this function triggered when click beri ulasan
    isModalOpen.value = true;
}

// Close Review Modal
function handleCloseReviewModal() {
    isModalOpen.value = false;
}

// Edit Review
const editReviewMode = ref(false);

watch(isModalOpen, (newVal) => {
    if (!newVal) {
        editReviewMode.value = false;
    }
});

const newReviewContent = ref("");
function openEditReview() {
    editReviewMode.value = true;
    newReviewContent.value = reviewPreview.value.content;
}

// Cancel Edit mode
function handleCancelEditMode() {
    editReviewMode.value = false;
    reviewPreview.value.rating = ratingPreview.value;
}

async function handleEditReview(reviewId, courseId) {
    await editReview(reviewId, newReviewContent.value, reviewPreview.value.rating);
    toast.success("Berhasil mengubah review", {
        timeout: 2000,
    });

    editReviewMode.value = false;

    await handleGetReview(courseId);
}

// Delete Review
async function handleDeleteReview(reviewId) {
    await deleteReview(reviewId);
    toast.success("Berhasil menghapus review", {
        timeout: 2000,
    });
    isModalOpen.value = false;
}

// Navigate user to the latest progress
async function handleNavigateUserToTheLatestProgress(courseId, courseSlug) {
    const kontenTerakhir = await getLatestUserProgress(currentUser.value.uid, courseId);
    navigateTo(`/${courseSlug}/${kontenTerakhir.slug.current}`);
}

const isContinueLearningButtonLoading = ref(false);

// Handle Delete Account
// TODO: Reauthenticate user before delete account
async function handleDeleteAccount() {
    await deleteAccount(currentUser.value.uid);
    toast.success("Berhasil menghapus akun", {
        timeout: 2000,
    });
    navigateTo("/");
}
</script>

<template>
    <div>
        <div class="bg-[#191825] py-8 flex flex-col gap-6 h-full con">
            <div class="tabs">
                <button class="btn btn-ghost tab" :class="{ 'tab-active, text-primary': activeTab === 'kursusku' }" @click="activeTab = 'kursusku'">Kursus</button>
                <div class="divider divider-horizontal"></div>
                <button class="btn btn-ghost tab" :class="{ 'tab-active, text-primary': activeTab === 'akunku' }" @click="activeTab = 'akunku'">Pengaturan</button>
            </div>
            <!-- $ Kursusku -->
            <!-- TODO: Sertifikat -->
            <!-- TODO: protected route -->
            <div v-show="activeTab === 'kursusku'" class="flex flex-col gap-3">
                <div class="mb-4">
                    <p v-if="currentUser" class="text-5xl">👋 Selamat Datang {{ currentUser.displayName }}</p>
                </div>

                <!-- TODO: perbaiki tampilan -->
                <h2 class="text-2xl font-medium">Kemajuan Belajar</h2>
                <div class="flex flex-col gap-3">
                    <div v-if="usersProgressLoading">
                        <span class="loading loading-bars loading-md"></span>
                    </div>
                    <div v-else>
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
                                <!-- $ Review Modal -->
                                <div>
                                    <label @click="handleGetReview(progress._id)" for="review_modal" class="bg-secondary px-10 py-1 rounded-sm text-background font-medium text-sm mr-2 cursor-pointer">
                                        Beri Ulasan
                                    </label>
                                    <!-- $ Input checkbox -->
                                    <input v-model="isModalOpen" type="checkbox" id="review_modal" class="modal-toggle" />
                                    <div class="modal text-slate-100">
                                        <div class="modal-box w-3/6">
                                            <!-- $ Review Form Input  -->
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
                                            <!-- $ Review Preview -->
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
                                                        <button @click="openEditReview()" class="btn btn-ghost btn-sm hover:btn-info">
                                                            <Icon name="mdi:lead-pencil"></Icon>
                                                        </button>
                                                        <button @click="handleDeleteReview(reviewPreview.id)" class="btn btn-ghost btn-sm hover:btn-error">
                                                            <Icon name="mdi:trash-can-outline"></Icon>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="mt-2">
                                                    <p v-if="!editReviewMode">
                                                        {{ reviewPreview.content }}
                                                    </p>
                                                    <div v-else>
                                                        <textarea class="textarea textarea-bordered w-full" v-model="newReviewContent"></textarea>
                                                        <div class="flex gap-2 mt-3">
                                                            <button @click="handleCancelEditMode" class="btn">Cancel</button>
                                                            <button @click="handleEditReview(reviewPreview.id, progress._id)" class="btn btn-primary">Kirim</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="modal-action">
                                                <label for="review_modal" class="cursor-pointer">close</label>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        @click="
                                            isContinueLearningButtonLoading = true;
                                            handleNavigateUserToTheLatestProgress(progress._id, progress.slug.current);
                                        "
                                        class="bg-primary px-10 py-1 rounded-sm text-background font-medium text-sm"
                                    >
                                        <span> Lanjut belajar </span>
                                        <span v-if="isContinueLearningButtonLoading" class="loading loading-bars loading-xs ml-1"></span>
                                    </button>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <h2 class="text-2xl font-medium">Rekomendasi Kursus</h2>
                <div class="grid grid-cols-3 gap-4">
                    <div v-if="recommendedCoursesPending">
                        <span class="loading loading-bars loading-md"></span>
                    </div>
                    <template v-else v-for="course in recommendedCourses" :key="course._id">
                        <NuxtLink :to="`/${course.slug.current}`">
                            <div class="card card-compact bg-slate-900 hover:bg-slate-800 shadow-xl">
                                <figure>
                                    <img :src="course.mainImage" alt="Shoes" class="w-full h-56 bg-cover" />
                                </figure>
                                <div class="card-body">
                                    <h2 class="card-title">{{ course.title }}</h2>
                                    <p class="text-lg">{{ course.shortDescription }}</p>
                                </div>
                            </div>
                        </NuxtLink>
                    </template>
                </div>
            </div>
            <!-- $ Akunku -->
            <div v-show="activeTab === 'akunku'">
                <div class="flex gap-10" v-if="currentUser">
                    <!-- $ Profile Picture Component -->
                    <!-- TODO: awal masuk gambar tidak terdetect -->
                    <!-- TODO: pembatasan priveledge untuk yang belum verifikasi  -->
                    <profile-picture-dashboard />

                    <!-- $ Profile Information -->
                    <div class="w-full flex flex-col gap-4">
                        <div class="flex flex-col gap-1">
                            <p>Nama:</p>
                            <!-- TODO: kurang convincing setelah ganti nama -->
                            <!-- TODO: cek ubah kata sandi -->
                            <div class="flex rounded-lg gap-4">
                                <input v-model="newName" type="text" class="input input-bordered w-full" />
                                <button @click="handleChangeName()" class="btn btn-primary">Ubah nama</button>
                            </div>
                            <p class="text-xs">Ini adalah nama yang akan dilihat user lain</p>
                        </div>
                        <div class="flex flex-col gap-1">
                            <p>Email:</p>
                            <div type="text" class="input input-bordered w-full flex items-center">{{ currentUser.email }}</div>
                            <p class="text-xs">Kamu tidak dapat mengubah surel yang digunakan</p>
                        </div>
                        <div class="flex flex-col gap-1">
                            <p>Kata sandi:</p>
                            <NuxtLink to="/auth/reset-password" class="btn btn-primary max-w-fit">Ubah kata sandi</NuxtLink>
                            <p class="text-xs">Anda hanya dapat mengubah kata sandi anda tiap 2 hari</p>
                        </div>
                        <div>
                            <p>Status Verifikasi Email:</p>
                            <div class="flex py-2">
                                <div v-if="currentUser.emailVerified" class="badge p-4 badge-success">
                                    <span class="text-lg">Sudah Verifikasi</span>
                                </div>
                                <div v-else class="badge p-4 badge-error">
                                    <span class="text-lg">Belum Verifikasi</span>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="flex flex-col gap-1">
                            <p>Hapus Akun</p>
                            <NuxtLink to="/auth/reset-password" class="btn btn-primary max-w-fit">Ubah kata sandi</NuxtLink>
                        </div> -->
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