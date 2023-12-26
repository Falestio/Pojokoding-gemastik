<template>
    <!-- TODO: Belum optimal fitur nya -->
    <div class="border border-slate-400 rounded">
        <div class="border-b border-slate-400">
            <div v-if="editor" class="flex flex-wrap gap-2 p-2 tiptap-buttons">
                <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"><Icon name="gg:format-heading"></Icon></button>
                <button @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }"><Icon name="clarity:bold-line"></Icon></button>
                <button @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }"><Icon name="clarity:italic-line"></Icon></button>
                <button @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }"><Icon name="clarity:strikethrough-line"></Icon></button>
                <div class="mx-1"></div>
                <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }"><Icon name="clarity:block-quote-line"></Icon></button>
                <button @click="editor.chain().focus().setHorizontalRule().run()"><icon name="clarity:bars-line"></icon></button>
                <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }"><Icon name="clarity:bullet-list-line"></Icon></button>
                <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }"><Icon name="clarity:number-list-line"></Icon></button>
                <div class="mx-1"></div>
                <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }"><Icon name="clarity:terminal-line"></Icon></button>
                <button @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }"><Icon name="clarity:code-line"></Icon></button>
                <div class="mx-1"></div>
                <button @click="editor.chain().focus().undo().run()"><Icon name="clarity:undo-line"></Icon></button>
                <button @click="editor.chain().focus().redo().run()"><Icon name="clarity:redo-line"></Icon></button>
            </div>
        </div>
        <div>
            <editor-content class="p-2" :editor="editor" />
        </div>
    </div>
</template>

<script setup>
import { useEditor, EditorContent, VueNodeViewRenderer } from "@tiptap/vue-3";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import CodeBlockTiptap from "./CodeBlockTiptap.vue";
import js from "highlight.js/lib/languages/javascript";
import py from "highlight.js/lib/languages/python";
import { lowlight } from "lowlight/lib/core";

lowlight.registerLanguage("js", js);
lowlight.registerLanguage("py", py);

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["update:modelValue"]);

let editor = useEditor({
    extensions: [Document, Paragraph, Text, Heading, Bold, Italic, Strike, Blockquote, HorizontalRule, ListItem, BulletList, OrderedList, History, Code, CodeBlockLowlight.configure({ lowlight })],
    content: props.modelValue,
    onUpdate: ({ editor }) => {
        emit("update:modelValue", editor.getHTML());
    },
});

watch(props.modelValue, (value) => {
    const isSame = editor.getHTML() === value;
    if (!isSame) {
        editor.commands.setContent(value, false);
    }
});

// onBeforeUnmount(() => {
//     editor.destroy();
//     atauuuu
//     editor.value.destroy();
// });
</script>

<style>
.is-active {
    color: #E285FF;
}

.tiptap-buttons * {
    border: none;
    background: none;
    outline: none;
    cursor: pointer;
}

.tiptap-buttons button * {
    font-size: 1.4em;
}

.tiptap {
    min-height: 200px;
}

.tiptap:focus {
    outline: none;
}

.tiptap h1,
.tiptap h2,
.tiptap h3,
.tiptap h4,
.tiptap h5,
.tiptap h6 {
    font-weight: bold;
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
}

.tiptap h1 {
    font-size: 2.25rem;
}

.tiptap h2 {
    font-size: 1.875rem;
}

.tiptap h3 {
    font-size: 1.5rem;
}

.tiptap h4 {
    font-size: 1.25rem;
}

.tiptap h5 {
    font-size: 1.125rem;
}

.tiptap h6 {
    font-size: 1rem;
    text-transform: uppercase;
}

.tiptap p {
    margin: 0.5rem 0;
    font-size: 1.25rem;
    line-height: 1.75rem;
}

.tiptap ul,
.tiptap ol {
    list-style-position: inside;
    line-height: 1.5;
}

.tiptap ul {
    list-style-type: disc;
}

.tiptap ol {
    list-style-type: decimal;
}

.tiptap ul ul,
.tiptap ol ul {
    list-style-type: circle;
    padding-left: 1em;
}

.tiptap ol ol,
.tiptap ul ol {
    list-style-type: lower-latin;
    padding-left: 1em;
}

.tiptap li {
    display: flex;
}

.tiptap table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
}

.tiptap th,
.tiptap td {
    border: 1px solid;
    padding: 0.5rem 1rem;
}

.tiptap thead {
    background-color: #2d3748;
}

.tiptap tbody {
    background-color: #4a5568;
}

.tiptap pre {
    font-size: 1.125rem;
    padding: 0.25rem;
    border-radius: 0.25rem;
}

.tiptap blockquote {
    margin: 20px 0;
    padding: 20px;
    background-color: #333; /* Warna latar belakang dari blockquote sedikit lebih terang dari latar belakang utama */
    border-left: 4px solid #ff9900; /* Garis di sisi kiri dengan warna oranye (Anda bisa menggantinya sesuai keinginan) */
    color: #f1f1f1; /* Warna teks */
    font-style: italic; /* Gaya teks miring */
    position: relative;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* Bayangan sederhana untuk memberi depth */
}

.tiptap blockquote cite {
    display: block;
    margin-top: 5px;
    text-align: right;
    color: #aaa; /* Warna teks untuk sumber kutipan */
    font-style: normal;
}
</style>