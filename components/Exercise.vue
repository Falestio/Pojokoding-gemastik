<script setup>
import { Codemirror } from "vue-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { runTests } from "@/utils/exercise/runTests";
import { saveProgress } from "@/utils/progress/saveProgress";
import { renderMarkdown } from "@/utils/content/renderMarkdown";

const currentUser = useCurrentUser();
const props = defineProps(["contentData", "sidebarContent"]);

const promptHtml = renderMarkdown(props.contentData.prompt);

function getExtensions() {
    if (props.contentData.languageConfig.languageName == "javascript") {
        return [javascript(), oneDark];
    }

    if (props.contentData.languageConfig.languageName == "python") {
        return [python(), oneDark];
    }
}

const code = ref(props.contentData.startingCode);
const compileCode = ref(props.contentData.compileCode);
const testCases = ref(props.contentData.testCases);
const stderr = ref("");
const stdout = ref("");

async function handleRunTests() {
    const compilableCode = compileCode.value + "\n\n" + code.value;
    // make every status in testCases become loading
    testCases.value = testCases.value.map((testCase) => ({ ...testCase, status: "loading" }));

    // run the tests and assign the result to testCases.value
    testCases.value = await runTests(compilableCode, testCases.value, props.contentData.languageConfig.languageId);

    console.log("Stderr value is", !!testCases.value.stderr)

    if (testCases.value.every((testCase) => testCase.status === "success")) {
        await handleSaveProgress();
    }
}

async function handleSaveProgress() {
    await saveProgress(currentUser.value.uid, props.contentData._id, props.contentData.course._ref, props.contentData.contentType);
}
</script>

<template>
    <div>
        <div class="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content flex flex-col p-8">
                <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>

                <div class="flex">
                    <div class="w-1/2">
                        <div class="mr-4">
                            <h2 class="text-2xl font-bold mb-4">{{ contentData.title }}</h2>
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
                        <codemirror :extensions="getExtensions()" v-model="code" :style="{ height: '100%', width: '100%', 'font-size': '18px' }"></codemirror>
                    </div>
                </div>
                <div class="w-full p-4 flex">
                    <button @click="handleRunTests()" class="btn btn-primary">Submit</button>
                </div>
                <Discussion v-if="currentUser" :content-data="contentData"></Discussion>

                <!--    
                <pre>
                    {{ code }}
                </pre>

                <pre>
                    {{ testCases }}
                </pre>

                <pre class="mt-8 w-[500px]">
                    {{ contentData }}
                </pre> -->
            </div>
            <div class="drawer-side">
                <label for="my-drawer-2" class="drawer-overlay"></label>
                <ul class="p-4 w-60 h-full border-r border-gray-700 text-base-content flex flex-col gap-2 overflow-x-hidden whitespace-normal">
                    <template v-for="content in sidebarContent" :key="content._id">
                        <NuxtLink :to="content.slug.current" :class="{ 'text-primary': content.completed }" class="hover:bg-slate-800 p-2 rounded flex items-center">
                            <Icon v-if="content.completed" name="mdi:checkbox-marked-circle" class="mr-2"></Icon>
                            <span class="text-lg">
                                {{ content.title }}
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