<template>
    <node-view-wrapper class="code-block">
        <select contenteditable="false" v-model="selectedLanguage">
            <option :value="null">auto</option>
            <option disabled>—</option>
            <option v-for="(language, index) in languages" :value="language" :key="index">
                {{ language }}
            </option>
        </select>
        <pre><code><node-view-content /></code></pre>
    </node-view-wrapper>
</template>

<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import { lowlight } from "lowlight/lib/core";

const props = nodeViewProps;
const languages = lowlight.listLanguages();
console.log("languages: ", languages);

const selectedLanguage = computed({
    get: () => props.node.attrs.language,
    set: (language) => updateAttributes({ language }),
});

function updateAttributes(attributes) {
    props.updateAttributes(attributes);
}
</script>

<style>
.code-block {
  position: relative;
}

.code-block select {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>