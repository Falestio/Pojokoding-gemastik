<template>
    <!-- TODO: Tampilkan jumlah pertanyaan, tampilkan sense of progress -->
    <!-- TODO: User dapat mereview semua pertanyaan setelah quiz selesai dikerjakan -->
    <div class="my-5 p-4 rounded-lg shadow-md border border-slate-600">
        <h2 class="text-xl mb-4">{{ quizData[questionIndex].question }}</h2>
        <!-- TODO: Tampilkan explanation dibawah pilihan ganda, dan tampilkan dalam sebuah box -->
        <!-- TODO: markdown compability -->
        <p v-if="correctChoiceSelected || wrongChoiceSelected" :class="{ 'text-red-500': wrongChoiceSelected, 'text-green-500': correctChoiceSelected }">
            {{ explanation }}
        </p>
        <!-- TODO: tambahkan a b c d kepada pilihan ganda -->
        <!-- TODO: Perbaiki UI pilihan ganda sehingga mirip dengan programiz -->
        <!-- TODO: markdown compability -->
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
        <!-- TODO: Selalu sediakan tombol check answer, jika diklik dan benar, swap menjadi tombol next question -->
        <button v-if="selectedAnswer !== null" @click="checkAnswer" class="btn btn-primary mr-4">Cek jawaban</button>
        <button v-if="correctChoiceSelected && questionIndex < quizData.length - 1" @click="nextQuestion" class="btn btn-primary">Pertanyaan selanjutnya</button>
        <div v-if="questionIndex === quizData.length - 1 && correctChoiceSelected" class="my-4">
            <span class="badge badge-success badge-lg">Quiz Selesai!</span> 
        </div>
    </div>
</template>
  
<script setup>
import { saveProgress } from '@/utils/progress/saveProgress';

const currentUser = useCurrentUser()

// TODO: Save Progress
const props = defineProps(["quizData", "contentId", "courseId", "contentType"]);

const questionIndex = ref(0);
let selectedAnswer = ref(null);
let correctChoiceSelected = ref(false);
let wrongChoiceSelected = ref(false);
let explanation = ref("");

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
};

async function nextQuestion() {
    if (questionIndex.value < props.quizData.length - 1) {
        questionIndex.value++;
        selectedAnswer.value = null;
        correctChoiceSelected.value = false;
        wrongChoiceSelected.value = false;
        explanation.value = "";
    }
};

async function handleAddProgress() {
    await saveProgress(currentUser.value.uid, props.contentId, props.courseId, props.contentType)
    
}
</script>