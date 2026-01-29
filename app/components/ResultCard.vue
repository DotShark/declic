<script setup lang="ts">
defineProps<{
  moduleName: string
  icon: string
  resultText: string
}>()
</script>

<template>
  <article
    class="flex flex-col gap-4 p-6 rounded-xl border border-gray-200 bg-white"
  >
    <header class="flex items-center gap-3">
      <div class="w-8 h-8">
        <Icon
          :name="icon"
          size="32"
          class="text-blue-600"
          aria-hidden="true"
        />
      </div>
      <h3 class="text-lg font-semibold font-family-poppins text-gray-900">
        {{ moduleName }}
      </h3>
    </header>
    <p class="text-base text-gray-700 font-family-inter leading-relaxed">
      {{ resultText }}
    </p>
  </article>
</template>
