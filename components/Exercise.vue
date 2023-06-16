<script setup>
import { Codemirror } from "vue-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { runTests } from "@/utils/exercise/runTests";
import { saveProgress } from "@/utils/progress/saveProgress";

const currentUser = useCurrentUser();
const props = defineProps(["contentData", "sidebarContent"]);
// TODO: dynamic language highlighting extensions load, tergantung dari data cms
const extensions = [python(), oneDark];

const code = ref(props.contentData.startingCode);
const compileCode = ref(props.contentData.compileCode);

const testCases = ref(props.contentData.testCases);

const stderr = ref("");

const stdout = ref("");

async function handleRunTests() {
    const compilableCode = compileCode.value + "\n\n" + code.value;
    testCases.value = await runTests(compilableCode, testCases.value, props.contentData.lang);

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
                        <h2 class="text-2xl font-bold mb-4">{{ contentData.title }}</h2>
                        <!-- TODO: Markdown compability in prompt -->
                        <p class="text-lg">{{ contentData.prompt }}</p>
                        <div class="grid gap-4 mr-4 mt-4">
                            <!-- TODO: Tampilkan code output, pada setiap test case -->
                            <!-- TODO: tampikan sampel input lebih jelas dengan menampilkannya sebagai parameter pada fungsi -->
                            <!-- TODO: Tampilkan animasi loading ketika sedang menjalankan kode  -->
                            <div v-for="testCase in testCases" :key="testCase._key" class="rounded-lg shadow-md p-4 relative border border-slate-700">
                                <div v-if="testCase.status == 'success'" class="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                                <div v-if="testCase.status == 'failed'" class="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                                <h2 class="text-xl font-bold mb-2">{{ testCase.testTitle }}</h2>
                                <p class="text-sm mb-2">{{ testCase.testDesc }}</p>
                                <div class="flex justify-between items-center">
                                    <div>
                                        <h3 class="font-semibold">Input:</h3>
                                        <pre class="text-sm rounded p-2">{{ testCase.stdin }}</pre>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold">Expected Output:</h3>
                                        <pre class="text-sm rounded p-2">{{ testCase.expectedOutput }}</pre>
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
                        <codemirror :extensions="extensions" v-model="code" :style="{ height: '100%', width: '100%', 'font-size': '18px' }"></codemirror>
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