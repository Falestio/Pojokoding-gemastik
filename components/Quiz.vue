<script setup>
import { saveProgress } from "@/utils/progress/saveProgress";
import { renderMarkdown } from "@/utils/content/renderMarkdown";
import { useContentStore } from "@/stores/content";

const currentUser = useCurrentUser();
const contentStore = useContentStore();
const progressStore = useProgressStore();
const props = defineProps(["isContentCompleted"]);

// foreach question in quizData lakukan renderMarkdown(question.question),
// lalu untuk setiap choices rendermarkdown(choices.text) dan renderMarkdown(choices.explanation)
// buatlah property rendered untuk menandai jika sudah di render
const clonedQuizData = JSON.parse(JSON.stringify(contentStore.contentData.quiz));

const renderedQuizData = clonedQuizData.map((question) => {
    question.question = renderMarkdown(question.question);
    question.choices = question.choices.map((choice) => {
        choice.text = renderMarkdown(choice.text);
        choice.explanation = renderMarkdown(choice.explanation);
        return choice;
    });
    return question;
});

// const renderedQuizData = props.quizData

console.log(renderedQuizData);

const questionIndex = ref(0);
let selectedAnswer = ref(null);
let correctChoiceSelected = ref(false);
let wrongChoiceSelected = ref(false);
let explanation = ref("");
let quizStarted = ref(false);
let quizDone = ref(false);

function startQuiz() {
    quizStarted.value = true;
}

function finishQuiz() {
    quizDone.value = true;
    // Add more logic if needed, e.g. saving the quiz result
}

function getCorrectAnswer(question) {
    return question.choices.find((choice) => choice.isCorrect);
}

function checkAnswer() {
    if (renderedQuizData[questionIndex.value].choices[selectedAnswer.value].isCorrect) {
        correctChoiceSelected.value = true;
        wrongChoiceSelected.value = false;
        explanation.value = renderedQuizData[questionIndex.value].choices[selectedAnswer.value].explanation;

        // If this is the last question and the answer is correct, the quiz has ended
        if (questionIndex.value === renderedQuizData.length - 1) {
            handleAddProgress();
        }
    } else {
        wrongChoiceSelected.value = true;
        correctChoiceSelected.value = false;
        explanation.value = renderedQuizData[questionIndex.value].choices[selectedAnswer.value].explanation;
    }
}

async function nextQuestion() {
    if (questionIndex.value < renderedQuizData.length - 1) {
        questionIndex.value++;
        selectedAnswer.value = null;
        correctChoiceSelected.value = false;
        wrongChoiceSelected.value = false;
        explanation.value = "";
    }
}

async function handleAddProgress() {
    // Save progress when user finishes the quiz
    await saveProgress(currentUser.value.uid, contentStore.contentData._id, contentStore.contentData.course._ref, contentStore.contentData.contentType);
    // Fetch the latest user progress
    await progressStore.fetchUserProgress(currentUser.value.uid, contentStore.contentData.course._ref);
    // Update the sidebar content with latest user progress
    contentStore.updateSidebarContent(progressStore.userProgress);
}
</script>

<template>
    <div class="my-5 p-4 rounded-lg shadow-md border border-slate-600">
        <div v-if="props.isContentCompleted">
            <!-- $ Jika sudah menyelesaikan quiz -->
            <div>
                <span class="text-3xl text-success mb-8">Quiz Selesai!</span>
                <div class="flex flex-col gap-4">
                    <template v-for="(question, index) in renderedQuizData" :key="question._key">
                        <div>
                            <span class="text-lg">Pertanyaan {{ index + 1 }}</span>
                            <span class="article" v-html="question.question"></span>
                        </div>
                        <div class="inline text-lg">
                            <span>Jawaban:</span>
                            <span class="article" v-html="getCorrectAnswer(question).text"></span>
                        </div>
                        <span class="article bg-slate-800 p-2 rounded" v-html="getCorrectAnswer(question).explanation"></span>
                    </template>
                </div>
            </div>
        </div>
        <div v-else>
            <!-- TODO: hanya bisa diakses oleh orang yang login -->
            <!-- $ Sebelum Quiz Dimulai -->
            <div v-if="!quizStarted">
                <h2 class="text-3xl">Quiz</h2>
                <p>Selesaikan quiz untuk menyimpan kemajuan</p>
                <p>Jumlah pertanyaan: {{ renderedQuizData.length }}</p>
                <button @click="startQuiz" data-cy="article-mulai-quiz" class="btn btn-primary mt-4">Mulai Quiz</button>
            </div>
            <!-- $ Quiz Sedang Dilaksanakan -->
            <div v-else-if="questionIndex < renderedQuizData.length && !quizDone">
                <span data-cy="quiz-nomor-pertanyaan">Pertanyaan {{ questionIndex + 1 }}/{{ renderedQuizData.length }}</span>
                <div data-cy="quiz-pertanyaan" class="article" v-html="renderedQuizData[questionIndex].question"></div>
                <div v-if="correctChoiceSelected || wrongChoiceSelected" class="bg-slate-800 p-4 rounded">
                    <p data-cy="quiz-jawaban-salah" v-if="wrongChoiceSelected" class="text-red-500">Salah</p>
                    <p data-cy="quiz-jawaban-benar" v-if="correctChoiceSelected" class="text-green-500">Benar</p>
                    <div data-cy="penjelasan" class="article" v-html="explanation"></div>
                </div>

                <div v-for="(choice, index) in renderedQuizData[questionIndex].choices" :key="choice._key" class="mt-4">
                    <label data-cy="quiz-choice" class="w-full h-full">
                        <div class="p-4 rounded border border-gray-700 mb-2 cursor-pointer flex items-center gap-4" :class="{ 'bg-gray-700': wrongChoiceSelected && selectedAnswer === index }">
                            <input class="radio" type="radio" v-model="selectedAnswer" :value="index" :disabled="wrongChoiceSelected && selectedAnswer === index" />
                            <div data-cy="quiz-choice-text" class="article" v-html="choice.text"></div>
                        </div>
                    </label>
                </div>
                <div class="flex gap-4 justify-end mt-4">
                    <button v-if="selectedAnswer !== null && !correctChoiceSelected" @click="checkAnswer" class="btn btn-primary mr-4" data-cy="quiz-cek-jawaban">Cek jawaban</button>
                    <button v-if="correctChoiceSelected && questionIndex < renderedQuizData.length - 1" @click="nextQuestion" class="btn btn-primary" data-cy="quiz-pertanyaan-selanjutnya">Pertanyaan selanjutnya</button>
                    <!-- TODO: ketika jawaban terakhir berhasil dijawab maka tombol di skip, user tidak bisa membaca pembahasan soal terakhir -->
                    <button v-if="correctChoiceSelected && questionIndex === renderedQuizData.length - 1" @click="finishQuiz" class="btn btn-primary" data-cy="quiz-selesai">Selesai</button>
                </div>
            </div>
            <!-- $ Quiz Selesai -->
            <div v-else-if="quizDone" class="my-4">
                <!-- TODO: tambahkan icon centang -->
                <span class="text-3xl text-success mb-8">Quiz Selesai!</span>
                <div class="flex flex-col gap-4">
                    <!-- TODO: Antar pertanyaan ada pemisah -->
                    <template v-for="(question, index) in renderedQuizData" :key="question._key">
                        <div>
                            <!-- TODO: tidak kelihatan kalau ini heading -->
                            <span class="text-lg">Pertanyaan {{ index + 1 }}</span>
                            <span class="article" v-html="question.question"></span>
                        </div>
                        <div class="inline text-lg">
                            <span>Jawaban:</span>
                            <span class="article" v-html="getCorrectAnswer(question).text"></span>
                        </div>
                        <span class="article bg-slate-800 p-2 rounded" v-html="getCorrectAnswer(question).explanation"></span>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
  