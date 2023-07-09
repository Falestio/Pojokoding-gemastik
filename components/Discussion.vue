<script setup>
import { createComment } from "@/utils/comment/createComment";
import { readAllComment } from "@/utils/comment/readAllComment";
import { deleteComment } from "@/utils/comment/deleteComment";
import { updateComment } from "@/utils/comment/updateComment";
import { upvoteComment } from "@/utils/comment/upvoteComment";
import { useToast } from "vue-toastification";

// Menerima property data artikel
const props = defineProps(["contentData"]);
const currentUser = useCurrentUser();
const toast = useToast();

// Menampung value inputan komentar baru
const newDiscussion = ref("");

// Create satu komentar
async function handleCreateComment() {
    await createComment(newDiscussion.value, props.contentData._id, currentUser.value.uid, currentUser.value.displayName, currentUser.value.photoURL);
    await handleGetAllComment();
    newDiscussion.value = "";
    toast.success("Berhasil menambah komentar", {
        timeout: 2000,
    });
}

// Mendapatkan semua komentar
// Triggered: Ketika user mengklik tombol tampilkan semua komentar
const allCommentInContent = ref([]);
const cursor = ref(null);

async function handleGetAllComment() {
    const result = await readAllComment(props.contentData._id);
    // Komentar dari pengguna yang sedang login ditampilkan paling atas
    allCommentInContent.value = result.comments.sort((a, b) => {
        if (a.userId === currentUser.value.uid) return -1;
        if (b.userId === currentUser.value.uid) return 1;
        return 0;
    });
    cursor.value = result.cursor;
}

async function handleGetMoreComments() {
    if (cursor.value) {
        const result = await readAllComment(props.contentData._id, cursor.value);
        allCommentInContent.value = [...allCommentInContent.value, ...result.comments];
        cursor.value = result.cursor;
    }
}

// Menghapus satu komentar
async function handleDeleteComment(commentId) {
    await deleteComment(commentId);
    await handleGetAllComment();
}

// Mengupdate satu komentar
const editingCommentValue = ref("");
const editMode = ref(false);
const editModeCommentId = ref("");

function openEditMode(commentId) {
    const comment = allCommentInContent.value.find((comment) => comment.id === commentId);
    if (comment) {
        editingCommentValue.value = comment.content;
    }
    editMode.value = true;
    editModeCommentId.value = commentId;
}

function cancelEditing() {
    editMode.value = false;
    editModeCommentId.value = "";
    editingCommentValue.value = "";
}

async function handleUpdateComment(commentId) {
    await updateComment(commentId, editingCommentValue.value);
    cancelEditing();
    toast.success("Komentar berhasil diubah", {
        timeout: 2000,
    });
    await handleGetAllComment();
}

// Melakukan Upvote
async function handleUpvoteComment(commentId) {
    await upvoteComment(commentId, currentUser.value.uid);
    const comment = allCommentInContent.value.find((comment) => comment.id === commentId);
    if (comment) {
        const userIndex = comment.upvotedUsers.indexOf(currentUser.value.uid);
        if (userIndex === -1) {
            comment.upvote++;
            comment.upvotedUsers.push(currentUser.value.uid);
        } else {
            comment.upvote--;
            comment.upvotedUsers.splice(userIndex, 1);
        }
    }
}
</script>

<template>
    <div>
        <!-- TODO: UI: Revisi UI, buat agar lebih mirip ui di stackoverflow -->
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
                        <label class="block text-sm font-bold mb-2" for="discussion">Tambah Diskusi</label>
                        <!-- TODO: FUNC: Add live markdown editor support  -->
                        <!-- Lakukan hal sama dengan di prompt komponen exercise -->
                        <textarea v-model="newDiscussion" id="discussion" class="textarea textarea-bordered w-full" required></textarea>
                    </div>
                    <div class="flex items-center justify-between">
                        <button @click="handleCreateComment()" class="btn btn-primary" type="submit">Kirim</button>
                    </div>
                </form>
            </div>

            <!-- Lihat semua komentar -->
            <div>
                <button @click="handleGetAllComment()" class="btn btn-primary my-4">Lihat komentar</button>
                <div class="space-y-4">
                    <!-- TODO: !!!FUNC: Integrasi fitur Reply (Balasan) -->
                    <!-- 
                    - terdapat tombol balas dan Balasan
                        - tombol balas sejajar dengan tanggal
                        - tombol balasan berada dibawah tanggal
                    - ketika user mengklik balasan fetch semua balasan yang memiliki id komentar
                    - balasan kurang lebih memiliki data yang sama dengan komentar
                    
                    - ketika user mengklik tombol balas akan muncul text area dimana user bisa menuliskan balasan -->
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
                                    <li @click="openEditMode(comment.id)" class="btn btn-ghost">Edit</li>
                                    <li onclick="confirmHapusModal.showModal()" class="btn btn-ghost">Hapus</li>
                                    <!-- Discussion deletion confirmation modal -->
                                    <dialog id="confirmHapusModal" class="modal">
                                        <form method="dialog" class="modal-box">
                                            <h3 class="text-white text-2xl">Hapus komentar ini?</h3>
                                            <div class="modal-action">
                                                <button @click="handleDeleteComment(comment.id)" class="btn btn-error">Hapus</button>
                                                <button class="btn">Batal</button>
                                            </div>
                                        </form>
                                    </dialog>
                                </ul>
                            </div>
                        </div>
                        <p v-if="!editMode || editModeCommentId != comment.id" class="text-sm">{{ comment.content }}</p>
                        <div v-if="!editMode || editModeCommentId != comment.id" class="flex items-center justify-between mt-2">
                            <div>
                                <div class="flex items-center">
                                    <span class="text-xs text-gray-500">{{ new Date(comment.createdAt.seconds * 1000).toLocaleString() }}</span>
                                    <button class="btn btn-ghost btn-sm">Balas</button>
                                </div>
                                <button @click="handleUpvoteComment(comment.id)" :class="{ 'text-blue-500': comment.upvotedUsers.includes(currentUser.uid) }" class="text-sm">Upvote ({{ comment.upvote }})</button>
                            </div>
                            <button class="btn- btn-ghost">Balasan(16)</button>
                        </div>
                        <div v-if="editMode && editModeCommentId === comment.id" class="mt-2">
                            <textarea v-model="editingCommentValue" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" rows="4" placeholder="Update your comment"></textarea>
                            <button @click="cancelEditing()" class="btn btn-sm mr-4 btn-secondary mt-2">Cancel</button>
                            <button @click="handleUpdateComment(comment.id)" :class="{ 'text-blue-500': comment.upvotedUsers.includes(currentUser.uid) }" class="btn btn-sm btn-primary mt-2">Update Comment</button>
                        </div>
                    </div>
                    <button v-if="cursor" @click="handleGetMoreComments()" class="btn btn-primary my-4">Load More Comments</button>
                </div>
            </div>
        </div>
    </div>
</template>