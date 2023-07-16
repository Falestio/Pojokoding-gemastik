<template>
    <!-- TODO: DO ALL QUIZ TODO -->
    <div class="my-5 p-4 rounded-lg shadow-md border border-slate-600">
        <!-- Sebelum Quiz Dimulai -->
        <div v-if="!quizStarted">
            <h2 class="text-3xl">Quiz</h2>
            <p>Selesaikan quiz untuk menyimpan kemajuan</p>
            <p>Jumlah pertanyaan: {{ quizData.length }}</p>
            <button @click="startQuiz" class="btn btn-primary mt-4">Mulai Quiz</button>
        </div>
        <!-- Quiz Dilaksanakan -->
        <div v-else-if="questionIndex < quizData.length && !quizDone">
            <span>Pertanyaan {{ questionIndex + 1 }}/{{ quizData.length }}</span>
            <h2 class="text-xl mb-4">{{ quizData[questionIndex].question }}</h2>
            <!-- TODO: UI: Tampilkan explanation dibawah pilihan ganda, dan tampilkan dalam sebuah box -->
            <!-- TODO: FUNC: markdown compability -->
            <p v-if="correctChoiceSelected || wrongChoiceSelected" :class="{ 'text-red-500': wrongChoiceSelected, 'text-green-500': correctChoiceSelected }">
                {{ explanation }}
            </p>
            <!-- TODO: UI: tambahkan a b c d kepada pilihan ganda -->
            <!-- TODO: UI: Perbaiki UI pilihan ganda sehingga mirip dengan programiz -->
            <!-- TODO: FUNC: markdown compability -->
            <div v-for="(choice, index) in quizData[questionIndex].choices" :key="choice._key">
                <label class="w-full h-full">
                    <div class="p-2 rounded mb-2 cursor-pointer flex items-center gap-4" :class="{ 'bg-gray-700': wrongChoiceSelected && selectedAnswer === index }">
                        <input class="radio" type="radio" v-model="selectedAnswer" :value="index" :disabled="wrongChoiceSelected && selectedAnswer === index" />
                        <p>
                            {{ choice.text }}
                        </p>
                    </div>
                </label>
            </div>
            <!-- TODO: FUNC: Selalu sediakan tombol check answer, jika diklik dan benar, swap menjadi tombol next question -->
            <button v-if="selectedAnswer !== null" @click="checkAnswer" class="btn btn-primary mr-4">Cek jawaban</button>
            <button v-if="correctChoiceSelected && questionIndex < quizData.length - 1" @click="nextQuestion" class="btn btn-primary">Pertanyaan selanjutnya</button>
            <button v-if="correctChoiceSelected && questionIndex === quizData.length - 1" @click="finishQuiz" class="btn btn-primary">Selesai</button>
        </div>
        <!-- Quiz Selesai -->
        <div v-else-if="quizDone" class="my-4">
            <span class="text-3xl text-success mb-8">Quiz Selesai!</span>
            <div class="flex flex-col gap-4">
                <template v-for="(question, index) in quizData" :key="question._key">
                    <span class="text-lg">{{ index + 1 }}. {{ question.question }}</span>
                    <span class="text-lg">Jawaban: {{ getCorrectAnswer(question).text }}</span>
                    <span class="text-md bg-slate-800 p-2 rounded">
                        {{ getCorrectAnswer(question).explanation }}
                    </span>
                </template>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { saveProgress } from "@/utils/progress/saveProgress";

const currentUser = useCurrentUser();
const props = defineProps(["quizData", "contentId", "courseId", "contentType"]);

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
    if (props.quizData[questionIndex.value].choices[selectedAnswer.value].isCorrect) {
        correctChoiceSelected.value = true;
        wrongChoiceSelected.value = false;
        explanation.value = props.quizData[questionIndex.value].choices[selectedAnswer.value].explanation;

        // If this is the last question and the answer is correct, the quiz has ended
        if (questionIndex.value === props.quizData.length - 1) {
            handleAddProgress();
        }
    } else {
        wrongChoiceSelected.value = true;
        correctChoiceSelected.value = false;
        explanation.value = props.quizData[questionIndex.value].choices[selectedAnswer.value].explanation;
    }
}

async function nextQuestion() {
    if (questionIndex.value < props.quizData.length - 1) {
        questionIndex.value++;
        selectedAnswer.value = null;
        correctChoiceSelected.value = false;
        wrongChoiceSelected.value = false;
        explanation.value = "";
    }
}

async function handleAddProgress() {
    await saveProgress(currentUser.value.uid, props.contentId, props.courseId, props.contentType);
}
</script>