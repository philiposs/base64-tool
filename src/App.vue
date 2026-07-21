<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { Copy, RefreshCw, Trash2 } from "@lucide/vue";
import { decodeBase64, encodeBase64 } from "./base64.js";

const mode = ref("encode");
const source = ref("");
const result = ref("");
const urlSafe = ref(false);
const statusMessage = ref("");
const statusType = ref("");
const input = ref(null);

const convert = () => {
  try {
    result.value = mode.value === "encode"
      ? encodeBase64(source.value, urlSafe.value)
      : decodeBase64(source.value);
    statusMessage.value = "";
    statusType.value = "";
  } catch (error) {
    result.value = "";
    statusMessage.value = error.message || "The data could not be converted.";
    statusType.value = "error";
  }
};

watch([source, mode, urlSafe], convert, { immediate: true });

const inputLabel = computed(() => mode.value === "encode" ? "Text" : "Base64");
const outputLabel = computed(() => mode.value === "encode" ? "Base64" : "Text");
const inputPlaceholder = computed(() => mode.value === "encode" ? "Type or paste text..." : "Paste Base64 data...");
const characterLabel = (count) => `${count} ${count === 1 ? "character" : "characters"}`;

const setMode = async (nextMode) => {
  mode.value = nextMode;
  await nextTick();
  input.value?.focus();
};

const clear = () => {
  source.value = "";
  input.value?.focus();
};

const swap = async () => {
  if (!result.value) return;
  source.value = result.value;
  mode.value = mode.value === "encode" ? "decode" : "encode";
  await nextTick();
  input.value?.focus();
};

const copyResult = async () => {
  if (!result.value) return;

  try {
    await navigator.clipboard.writeText(result.value);
  } catch {
    const output = document.querySelector("#output");
    output.select();
    document.execCommand("copy");
  }

  statusMessage.value = "Copied to clipboard.";
  statusType.value = "success";
};
</script>

<template>
  <div class="page">
    <header class="site-header">
      <div class="shell header-row">
        <a class="brand" href="/" aria-label="Base64 home">
          <span class="brand-mark" aria-hidden="true">64</span>
          <span>
            <strong>Base64</strong>
            <small>chleb.app</small>
          </span>
        </a>
        <span class="privacy"><span class="privacy-dot"></span>Runs locally in your browser</span>
      </div>
    </header>

    <main class="shell main-content">
      <div class="intro">
        <p class="eyebrow">UTILITY</p>
        <h1>Base64 converter</h1>
        <p>Encode text to Base64 and decode it back. Your data never leaves your device.</p>
      </div>

      <section class="converter" aria-labelledby="converter-title">
        <h2 id="converter-title" class="visually-hidden">Converter</h2>
        <div class="mode-switch" role="tablist" aria-label="Conversion mode">
          <button
            class="mode"
            :class="{ active: mode === 'encode' }"
            type="button"
            role="tab"
            :aria-selected="mode === 'encode'"
            @click="setMode('encode')"
          >
            Encode
          </button>
          <button
            class="mode"
            :class="{ active: mode === 'decode' }"
            type="button"
            role="tab"
            :aria-selected="mode === 'decode'"
            @click="setMode('decode')"
          >
            Decode
          </button>
        </div>

        <div class="workspace">
          <div class="field-group">
            <div class="field-head">
              <label for="input">{{ inputLabel }}</label>
              <span>{{ characterLabel(source.length) }}</span>
            </div>
            <textarea
              id="input"
              ref="input"
              v-model="source"
              spellcheck="false"
              :placeholder="inputPlaceholder"
            ></textarea>
          </div>

          <button class="swap-button" type="button" title="Move result to input" aria-label="Move result to input" @click="swap">
            <RefreshCw :size="18" aria-hidden="true" />
          </button>

          <div class="field-group">
            <div class="field-head">
              <label for="output">{{ outputLabel }}</label>
              <span>{{ characterLabel(result.length) }}</span>
            </div>
            <textarea id="output" :value="result" readonly placeholder="The result will appear here..."></textarea>
          </div>
        </div>

        <div class="toolbar">
          <label class="check-control">
            <input v-model="urlSafe" type="checkbox" />
            <span aria-hidden="true"></span>
            URL-safe
          </label>
          <p class="status" :class="statusType" role="status" aria-live="polite">{{ statusMessage }}</p>
          <div class="actions">
            <button class="button secondary" type="button" @click="clear">
              <Trash2 :size="18" aria-hidden="true" />
              Clear
            </button>
            <button class="button primary" type="button" :disabled="!result" @click="copyResult">
              <Copy :size="18" aria-hidden="true" />
              Copy result
            </button>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="shell footer-row">
        <p>chleb.app</p>
        <p>Simple, private, and processed locally.</p>
      </div>
    </footer>

  </div>
</template>
