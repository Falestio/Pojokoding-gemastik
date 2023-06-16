<script setup>
import { createComment } from "@/utils/comment/createComment";
import { readAllComment } from "@/utils/comment/readAllComment";
import { deleteComment } from "@/utils/comment/deleteComment";
import { updateComment } from "@/utils/comment/updateComment";
import { upvoteComment } from "@/utils/comment/upvoteComment";

// Menerima property data artikel
const props = defineProps(["contentData"]);
const currentUser = useCurrentUser()

// Menampung value inputan komentar baru
const newDiscussion = ref("");

// Create satu komentar
async function handleCreateComment() {
    await createComment(newDiscussion.value, props.contentData._id, currentUser.value.uid, currentUser.value.displayName, currentUser.value.photoURL);
    await handleGetAllComment();
    newDiscussion.value = ""
} 

// Mendapatkan semua komentar
// Triggered: Ketika user mengklik tombol tampilkan semua komentar
const allCommentInContent = ref(null);
async function handleGetAllComment() {
    allCommentInContent.value = await readAllComment(props.contentData._id);
}

// Menghapus satu komentar
async function handleDeleteComment(commentId) {
    await deleteComment(commentId);
    await handleGetAllComment();
}

// Mengupdate satu komentar
const editingCommentValue = ref("");
const editMode = ref(false)
const editModeCommentId = ref("")

function openEditMode(commentId){
    editMode.value = true
    editModeCommentId.value = commentId
}

function cancelEditing(){
    editMode.value = false
    editModeCommentId.value = ""
    editingCommentValue.value = ""
}

async function handleUpdateComment(commentId) {
    await updateComment(commentId, editingCommentValue.value)
    cancelEditing()
    await handleGetAllComment()
}

// Melakukan Upvote
async function handleUpvoteComment(commentId) {
    await upvoteComment(commentId)
    await handleGetAllComment()
}

</script>

<template>
    <div>
        <!-- TODO: Revisi UI, buat agar lebih mirip ui di stackoverflow -->
        <!-- TODO: Integrasi fitur Reply (Balasan) -->
        <!-- TODO: tampilkan notifikasi berhasil melakukan crud -->
        <div class="w-[700px]">
            
            <!-- Submit komentar -->
            <div class="w-full mx-auto my-4 border rounded">
                <form @submit.prevent="submitDiscussion" class="shadow-md rounded p-4 mb-4">
                    <div class="mb-4 flex items-center gap-3">
                        <img :src="currentUser.photoURL" class="h-10 w-10 rounded-full" />
                        <label class="block text-sm font-bold mb-2" for="username">
                            {{ currentUser.displayName }}
                        </label>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2" for="discussion"> Discussion </label>
                        <!-- TODO: Add live markdown editor support  -->
                        <textarea v-model="newDiscussion" id="discussion" class="textarea textarea-bordered w-full" required></textarea>
                    </div>
                    <div class="flex items-center justify-between">
                        <button @click="handleCreateComment()" class="btn btn-primary" type="submit">Submit</button>
                    </div>
                </form>
            </div>

            <!-- Lihat semua komentar -->
            <!-- TODO: Prevent user yang sama untuk upvote lebih dari 1 kali -->
            <!-- TODO: Fetch top 3 diskusi dengan banyak upvote -->
            <!-- TODO: Paginated fetch -->
            <!-- TODO: tampilkan komentar sendiri paling atas -->
            <div>
                <button @click="handleGetAllComment()" class="btn btn-primary my-4">Lihat komentar</button>
                <div class="space-y-4">
                    <div v-for="comment in allCommentInContent" :key="comment.id" class="p-4 bg-slate-700 rounded shadow border">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center">
                                <img :src="comment.photoUrl" alt="Profile" class="h-8 w-8 rounded-full mr-2" />
                                <span class="font-bold text-sm">{{ comment.username }}</span>
                            </div>
                            <div class="dropdown">
                                <label tabindex="0" class="btn btn-ghost btn-md">
                                    <Icon name="mdi:dots-vertical" v-if="comment.userId === currentUser.uid"></Icon>
                                </label>
                                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <!-- TODO: ketika ingin edit diskusi tampilkan value dari diskusi sebelumnya di textarea -->
                                    <li @click="openEditMode(comment.id)" class="btn btn-ghost">Edit</li>
                                    <!-- TODO: ketika ingin menghapus diskusi tampilkan "are you sure"  -->
                                    <li @click="handleDeleteComment(comment.id)" class="btn btn-ghost">Hapus</li>
                                </ul>
                            </div>
                        </div>
                        <p v-if="!editMode || editModeCommentId != comment.id" class="text-sm">{{ comment.content }}</p>
                        <div v-if="!editMode || editModeCommentId != comment.id" class="flex items-center justify-between mt-2">
                            <div class="flex items-center">
                                <span class="text-xs text-gray-500">{{ new Date(comment.createdAt.seconds * 1000).toLocaleString() }}</span>
                                <button class="btn btn-ghost btn-sm">Balas</button>
                            </div>
                            <button @click="handleUpvoteComment(comment.id)" class="text-sm">Upvote ({{ comment.upvote }})</button>
                        </div>
                        <div v-if="editMode && editModeCommentId === comment.id" class="mt-2">
                            <textarea v-model="editingCommentValue" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" rows="4" placeholder="Update your comment"></textarea>
                            <button @click="cancelEditing()" class="btn btn-sm mr-4 btn-secondary mt-2">Cancel</button>
                            <button @click="handleUpdateComment(comment.id)" class="btn btn-sm btn-primary mt-2">Update Comment</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>