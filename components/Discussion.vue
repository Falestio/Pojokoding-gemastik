<script setup>
import { createComment } from "@/utils/comment/createComment";
import { readAllComment } from "@/utils/comment/readAllComment";
import { deleteComment } from "@/utils/comment/deleteComment";
import { updateComment } from "@/utils/comment/updateComment";
import { upvoteComment } from "@/utils/comment/upvoteComment";
import { createReply } from "@/utils/comment/createReply";
import { readAllReplyInOneComment } from "@/utils/comment/readAllReplyInOneComment";
import { updateReply } from "@/utils/comment/updateReply";
import { deleteReply } from "@/utils/comment/deleteReply";
import { useToast } from "vue-toastification";

// Menerima property data artikel
const props = defineProps(["contentData"]);
const currentUser = useCurrentUser();
const toast = useToast();

// CREATE KOMENTAR
const newDiscussion = ref("");
async function handleCreateComment() {
    await createComment(newDiscussion.value, props.contentData._id, currentUser.value.uid, currentUser.value.displayName, currentUser.value.photoURL);
    await handleGetAllComment();
    newDiscussion.value = "";
    toast.success("Berhasil menambah komentar", {
        timeout: 2000,
    });
}

// READ ALL KOMENTAR
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

// UPDATE KOMENTAR
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

// DELETE KOMENTAR
async function handleDeleteComment(commentId) {
    await deleteComment(commentId);
    await handleGetAllComment();
}

const showDeleteConfirmationModal = ref(false);
const commentIdToDelete = ref("");

// UPVOTE KOMENTAR
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

// CREATE REPLY
const newReply = ref("");
async function handleCreateReply(commentId) {
    await createReply(newReply.value, commentId, currentUser.value.uid, currentUser.value.displayName, currentUser.value.photoURL);
    newReply.value = "";
    toast.success("Berhasil menambah balasan", {
        timeout: 3000,
    });
}

const showReplyForm = ref(null);

function openReplyForm(commentId) {
    if (showReplyForm.value === commentId) {
        showReplyForm.value = null;
    } else {
        showReplyForm.value = commentId;
    }
}

// READ ALL REPLY IN ONE COMMENT
const allReplies = ref([]);

function allRepliesInOneComment(commentId) {
    return allReplies.value.filter((reply) => reply.commentId === commentId);
}

async function handleGetAllReplyInOneComment(commentId) {
    const result = await readAllReplyInOneComment(commentId);
    console.log(result);

    // if reply with reply.id is not yet in the allReplies array then push it to the array
    result.forEach((reply) => {
        if (!allReplies.value.find((replyInAllReplies) => replyInAllReplies.id === reply.id)) {
            allReplies.value.push(reply);
        }
    });
}

// UPDATE REPLY
const editModeReply = ref(false);
const editModeReplyId = ref("");
const editingReplyValue = ref("");

async function handleUpdateReply() {
    if (!editingReplyValue.value) {
        return; // show error message about empty content
    }
    await updateReply(editModeReplyId.value, editingReplyValue.value);
    toast.success("Balasan berhasil diubah", {
        timeout: 2000,
    });
    cancelReplyEditing();
}

function openReplyEditMode(replyId, commentId) {
    editModeReply.value = true;
    editModeReplyId.value = replyId;
    const allReplies = allRepliesInOneComment(commentId);
    const reply = allReplies.find((reply) => reply.id === replyId);
    if (reply) {
        editingReplyValue.value = reply.content;
    }
}

function cancelReplyEditing() {
    editModeReply.value = false;
    editModeReplyId.value = "";
    editingReplyValue.value = "";
}

// DELETE REPLY
async function handleDeleteReply(replyId, commentId) {
    await deleteReply(replyId);
    await handleGetAllReplyInOneComment(commentId);
}

const showConfirmDeleteReplyModal = ref(false);
</script>

<template>
    <div>
        <!-- TODO: Standardisasi UI -->
        <div class="">
            <!-- $ Submit komentar -->
            <div class="divider"></div>
            <h2 class="text-3xl font-bold">Diskusi</h2>
            <div class="w-full mx-auto my-4 border border-slate-500 rounded">
                <form @submit.prevent="submitDiscussion" class="shadow-md rounded p-4 mb-4">
                    <div class="mb-4 flex items-center gap-3">
                        <img :src="currentUser.photoURL" class="h-10 w-10 rounded-full" />
                        <label class="block text-sm font-bold mb-2" for="username">
                            {{ currentUser.displayName }}
                        </label>
                    </div>
                    <div class="mb-4">
                        <!-- Lakukan hal sama dengan di prompt komponen exercise -->
                        <tiptap v-model="newDiscussion"></tiptap>
                    </div>
                    <div class="flex items-center justify-between">
                        <button @click="handleCreateComment()" class="btn btn-primary" type="submit">Kirim</button>
                    </div>
                </form>
            </div>

            <!-- $ Lihat semua komentar -->
            <div>
                <button @click="handleGetAllComment()" class="btn btn-primary my-4">Lihat komentar</button>
                <div class="space-y-4">
                    <div v-for="comment in allCommentInContent" :key="comment.id" class="p-4 bg-slate-700 rounded shadow border">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center">
                                <img :src="comment.photoUrl" alt="Profile" class="h-8 w-8 rounded-full mr-2" />
                                <span class="font-bold text-sm">{{ comment.username }}</span>
                            </div>
                            <!-- $ Dropdown untuk edit dan hapus komentar -->
                            <div class="dropdown dropdown-end">
                                <label tabindex="0" class="btn btn-ghost btn-md">
                                    <Icon name="mdi:dots-vertical" v-if="comment.userId === currentUser.uid"></Icon>
                                </label>
                                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li @click="openEditMode(comment.id)" class="btn btn-ghost">Edit</li>
                                    <!-- $ Discussion deletion confirmation modal -->
                                    <li
                                        @click="
                                            showDeleteConfirmationModal = true;
                                            commentIdToDelete = comment.id;
                                        "
                                        class="btn btn-ghost"
                                    >
                                        Hapus
                                    </li>
                                </ul>
                            </div>
                            <!-- $ Dialog untuk konfirmasi penghapusan komentar -->
                            <dialog :open="showDeleteConfirmationModal" class="modal">
                                <form method="dialog" class="modal-box">
                                    <h3 class="text-white text-2xl">Hapus komentar ini?</h3>
                                    <div class="modal-action">
                                        <button
                                            @click="
                                                showDeleteConfirmationModal = false;
                                                handleDeleteComment(commentIdToDelete);
                                            "
                                            class="btn btn-error"
                                        >
                                            Hapus
                                        </button>
                                        <button @click="showDeleteConfirmationModal = false" class="btn">Batal</button>
                                    </div>
                                </form>
                            </dialog>
                        </div>
                        <!-- $ Konten Komentar -->
                        <div v-if="!editMode || editModeCommentId != comment.id" class="article" v-html="comment.content"></div>
                        <div v-if="!editMode || editModeCommentId != comment.id" class="flex flex-col justify-between mt-2">
                            <div class="flex">
                                <div class="flex items-center">
                                    <span class="text-xs text-gray-500">{{ new Date(comment.createdAt.seconds * 1000).toLocaleString() }}</span>
                                    <button @click="openReplyForm(comment.id)" class="btn btn-ghost btn-sm">Balas</button>
                                </div>
                                <button @click="handleUpvoteComment(comment.id)" :class="{ 'text-blue-500': comment.upvotedUsers.includes(currentUser.uid) }" class="text-sm">
                                    Upvote ({{ comment.upvote }})
                                </button>
                            </div>
                            <div>
                                <button @click="handleGetAllReplyInOneComment(comment.id)" class="btn- btn-ghost">Balasan</button>
                            </div>
                        </div>
                        <div v-if="editMode && editModeCommentId === comment.id" class="mt-2">
                            <textarea v-model="editingCommentValue" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" rows="4" placeholder="Update your comment"></textarea>
                            <button @click="cancelEditing()" class="btn btn-sm mr-4 btn-secondary mt-2">Cancel</button>
                            <button @click="handleUpdateComment(comment.id)" :class="{ 'text-blue-500': comment.upvotedUsers.includes(currentUser.uid) }" class="btn btn-sm btn-primary mt-2">
                                Update Comment
                            </button>
                        </div>

                        <!-- $ REPLY -->
                        <div class="space-y-4 mt-4">
                            <!-- $ CREATE NEW REPLY -->
                            <div v-if="showReplyForm === comment.id" class="ml-8 mx-auto my-4 border rounded">
                                <form @submit.prevent="submitDiscussion" class="shadow-md rounded p-4 mb-4">
                                    <div class="mb-4 flex items-center gap-3">
                                        <img :src="currentUser.photoURL" class="h-10 w-10 rounded-full" />
                                        <label class="block text-sm font-bold mb-2" for="username">
                                            {{ currentUser.displayName }}
                                        </label>
                                    </div>
                                    <div class="mb-4">
                                        <label class="block text-sm font-bold mb-2" for="discussion">Tambah balasan</label>
                                        <!-- Lakukan hal sama dengan di prompt komponen exercise -->
                                        <tiptap v-model="newReply"></tiptap>
                                        <!-- <textarea v-model="newReply" id="discussion" class="textarea textarea-bordered w-full" required></textarea> -->
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <button @click="handleCreateReply(comment.id)" class="btn btn-primary" type="submit">Kirim</button>
                                        <button @click="openReplyForm(null)" class="btn" type="submit">Cancel</button>
                                    </div>
                                </form>
                            </div>

                            <!-- $ LIST OF REPLY -->
                            <div v-for="reply in allRepliesInOneComment(comment.id)" :key="reply.id" class="p-4 bg-slate-800 rounded shadow border ml-8">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center">
                                        <img :src="reply.photoUrl" alt="Profile" class="h-8 w-8 rounded-full mr-2" />
                                        <span class="font-bold text-sm">{{ reply.username }}</span>
                                    </div>
                                    <div class="dropdown dropdown-end">
                                        <label tabindex="0" class="btn btn-ghost btn-md">
                                            <Icon name="mdi:dots-vertical" v-if="reply.userId === currentUser.uid"></Icon>
                                        </label>
                                        <!-- $ Dropdown delete Edit atau Hapus  -->
                                        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                            <li @click="openReplyEditMode(reply.id, comment.id)" class="btn btn-ghost">Edit</li>
                                            <li @click="showConfirmDeleteReplyModal = true" class="btn btn-ghost">Hapus</li>
                                        </ul>
                                        <!-- $ Modal Konfirmasi Hapus Balasan -->
                                        <dialog :open="showConfirmDeleteReplyModal" class="modal">
                                            <form method="dialog" class="modal-box">
                                                <div class="text-white">
                                                    {{ reply.id }}
                                                </div>
                                                <h3 class="text-white text-2xl">Hapus balasan ini?</h3>
                                                <div class="modal-action">
                                                    <button
                                                        @click="
                                                            showConfirmDeleteReplyModal = false;
                                                            handleDeleteReply(reply.id, comment.id);
                                                        "
                                                        class="btn btn-error"
                                                    >
                                                        Hapus
                                                    </button>
                                                    <button @click="showConfirmDeleteReplyModal = false" class="btn">Batal</button>
                                                </div>
                                            </form>
                                        </dialog>
                                    </div>
                                </div>
                                <!-- $ Konten Reply -->
                                <p v-if="!editModeReply || editModeReplyId != reply.id" class="article" v-html="reply.content"></p>
                                <div v-if="!editModeReply || editModeReplyId != reply.id" class="flex flex-col justify-between mt-2">
                                    <div class="flex">
                                        <div class="flex items-center">
                                            <span class="text-xs text-gray-500">{{ new Date(reply.createdAt.seconds * 1000).toLocaleString() }}</span>
                                            <button class="btn btn-ghost btn-sm">Balas</button>
                                        </div>
                                        <button @click="handleUpvoteComment(reply.id)" :class="{ 'text-blue-500': reply.upvotedUsers.includes(currentUser.uid) }" class="text-sm">
                                            Upvote ({{ reply.upvote }})
                                        </button>
                                    </div>
                                </div>
                                <div v-if="editModeReply && editModeReplyId === reply.id" class="mt-2">
                                    <textarea
                                        v-model="editingReplyValue"
                                        class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                                        rows="4"
                                        placeholder="Update your reply"
                                    ></textarea>
                                    <button @click="cancelReplyEditing()" class="btn btn-sm mr-4 btn-secondary mt-2">Cancel</button>
                                    <button @click="handleUpdateReply(reply.id)" :class="{ 'text-blue-500': reply.upvotedUsers.includes(currentUser.uid) }" class="btn btn-sm btn-primary mt-2">
                                        Update reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button v-if="cursor" @click="handleGetMoreComments()" class="btn btn-primary my-4">Load More Comments</button>
                </div>
            </div>
        </div>
    </div>
</template>