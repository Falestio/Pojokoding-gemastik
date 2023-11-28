<script setup>
import { Codemirror } from "vue-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { runCode } from "@/utils/exercise/runCode";
import { saveProgress } from "@/utils/progress/saveProgress";
import { renderMarkdown } from "@/utils/content/renderMarkdown";
import { useToast } from "vue-toastification";
import { useContentStore } from "@/stores/content";
import { useProgressStore } from "@/stores/progress";

const currentUser = useCurrentUser();
// const props = defineProps(["contentData", "sidebarContent"]);
const contentStore = useContentStore();
const progressStore = useProgressStore();
const toast = useToast();

const isContentCompleted = computed(() => {
    return contentStore.contentData.sidebar.some((item) => {
        return item._id === contentStore.contentData._id && item.completed;
    });
});

const promptHtml = renderMarkdown(contentStore.contentData.prompt);

function getExtensions() {
    if (contentStore.contentData.languageConfig.languageName == "javascript") {
        return [javascript(), oneDark];
    }

    if (contentStore.contentData.languageConfig.languageName == "python") {
        return [python(), oneDark];
    }
}

const code = ref(contentStore.contentData.startingCode);
const compileCode = ref(contentStore.contentData.compileCode);
const testCases = ref(contentStore.contentData.testCases);
const stderr = ref("");
const stdout = ref("");

async function handleRunTests() {
    // make every status in testCases become loading
    testCases.value = testCases.value.map((testCase) => ({ ...testCase, status: "loading" }));

    // Combine the compile code and the code into one string, seperated by newline
    const compilableCode = code.value + "\n\n" + compileCode.value;

    // Combine all stdin into one string, seperated by space
    const compiledStdin = testCases.value.map((testCase) => testCase.stdin).join(" ");

    // get language name
    const languageName = contentStore.contentData.languageConfig.languageName;

    // run the tests and assign the result to testCases.value
    const output = await runCode(compilableCode, compiledStdin, languageName);

    // TESTING PURPOSES
    // const output = {
    //     status: "success",
    //     exception: 'Error: Command failed: timeout 7 python3 index.py Traceback (most recent call last): File "index.py", line 3, in <module> prit(Hello + name) NameError: name "prit" is not defined',
    //     stdout: null,
    //     stderr: 'Traceback (most recent call last): File "index.py", line 3, in <module> prit("Hello "+ name) NameError: name "prit" is not defined',
    //     executionTime: 41,
    //     limitRemaining: 59125,
    //     stdin: "21 12",
    // };

    let parsedStdout = [];
    try {
        parsedStdout = JSON.parse(output.stdout.replace(/'/g, '"'));
    } catch (e) {
        console.error("Error parsing stdout:", e);
    }

    // Handle jika output berhasil dikeluarkan
    if (parsedStdout.length && !output.stderr && !output.exception) {
        testCases.value = testCases.value.map((testCase, index) => {
            if (index < parsedStdout.length && parsedStdout[index] == testCase.expectedOutput) {
                return { ...testCase, status: "success", stdout: parsedStdout[index], stderr: output.stderr };
            } else {
                return { ...testCase, status: "failed", stdout: parsedStdout[index] || null, stderr: output.stderr };
            }
        });
    }

    // Handle jika stderr atau execption dikeluarkan
    if (output.stderr || output.exception) {
        testCases.value = testCases.value.map((testCase) => {
            return {
                ...testCase,
                status: "failed",
                stdout: null,
                stderr: output.stderr || output.exception,
            };
        });
    }

    if (testCases.value.every((testCase) => testCase.status === "success")) {
        toast.success("Selamat, kamu berhasil menyelesaikan latihan ini!", {
            timeout: 5000,
        });
        await handleSaveProgress();
    }
}

async function handleSaveProgress() {
    // Save progress when user finishes the quiz
    await saveProgress(currentUser.value.uid, contentStore.contentData._id, contentStore.contentData.course._ref, contentStore.contentData.contentType);
    // Fetch the latest user progress
    await progressStore.fetchUserProgress(currentUser.value.uid, contentStore.contentData.course._ref);
    // Update the sidebar content with latest user progress
    contentStore.updateSidebarContent(progressStore.userProgress);
}
</script>

<template>
    <div>
        <!-- TODO: Penampilkan pesan error kurang jelas -->
        <div class="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content flex flex-col p-8">
                <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>
                <div class="flex">
                    <div class="w-1/2">
                        <div class="mr-4">
                            <h2 class="text-2xl font-bold mb-4">{{ contentStore.contentData.displayTitle }}</h2>
                            <div class="article" v-html="promptHtml"></div>
                        </div>
                        <div class="grid gap-4 mr-4 mt-4">
                            <div v-for="testCase in testCases" :key="testCase._key" class="rounded-lg shadow-md p-4 relative border border-slate-700">
                                <div v-if="testCase.status == 'success'" class="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                                <div v-if="testCase.status == 'failed'" class="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                                <div v-if="testCase.status == 'loading'" class="absolute top-0 left-0 h-2 w-full p-2">
                                    <div class="flex justify-end">
                                        <span class="loading loading-bars loading-sm"></span>
                                    </div>
                                </div>
                                <h2 class="text-xl font-bold mb-2">{{ testCase.testTitle }}</h2>
                                <p class="text-sm mb-2">{{ testCase.testDesc }}</p>
                                <div class="flex justify-between items-center">
                                    <div>
                                        <h3 class="font-semibold">Input:</h3>
                                        <pre class="text-sm rounded p-2">{{ testCase.functionCallExample }}</pre>
                                    </div>
                                    <div class="flex flex-col gap-4">
                                        <div>
                                            <h3 class="font-semibold">Output yang diharapkan:</h3>
                                            <pre class="text-sm rounded p-2">{{ testCase.expectedOutput }}</pre>
                                        </div>
                                        <div v-if="!testCase.stderr">
                                            <h3 class="font-semibold">Output yang didapat:</h3>
                                            <pre class="text-sm rounded p-2">{{ testCase.stdout }}</pre>
                                        </div>
                                        <div v-if="testCase.stderr">
                                            <h3 class="font-semibold">Terjadi error:</h3>
                                            <pre class="text-sm rounded p-2">{{ testCase.stderr }}</pre>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="testCase.status" class="mt-4">
                                    <span v-if="testCase.status == 'success'" class="badge badge-md badge-success">Berhasil</span>
                                    <span v-if="testCase.status == 'failed'" class="badge badge-md badge-error">Gagal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-1/2">
                        <!-- TODO: Jika user telah mengerjakan latihan, tampilkan status sudah mengerjakan (hasil test yang hijau) -->
                        <!-- TODO: JIka user telah mengerjakan latihan, tampilkan kode di code editor -->
                        <codemirror :extensions="getExtensions()" v-model="code" :style="{ height: '100%', width: '100%', 'font-size': '18px' }"></codemirror>
                    </div>
                </div>
                <div class="w-full p-4 flex">
                    <button @click="handleRunTests()" class="btn btn-primary">Submit</button>
                </div>
                <Discussion v-if="currentUser" :content-data="contentStore.contentData"></Discussion>
            </div>
            <div class="drawer-side">
                <label for="my-drawer-2" class="drawer-overlay"></label>
                <ul class="p-4 w-60 h-full border-r border-gray-700 text-base-content flex flex-col gap-2 overflow-x-hidden whitespace-normal">
                    <template v-for="content in contentStore.sidebarContent" :key="content._id">
                        <NuxtLink :to="content.slug.current" :class="{ 'text-primary': content.completed }" class="hover:bg-slate-800 p-2 rounded flex items-center">
                            <Icon v-if="content.completed" name="mdi:checkbox-marked-circle" class="mr-2 min-w-min"></Icon>
                            <span class="text-lg">
                                {{ content.displayTitle }}
                            </span>
                        </NuxtLink>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</template>

<style>
.text-editor {
    width: 500px;
    height: 500px;
}
</style>