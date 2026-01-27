<script setup lang="ts">
defineProps<{
  text: string
  selected: boolean
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE'
}>()

defineEmits<{
  select: []
}>()
</script>

<template>
  <button
    class="flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer text-left"
    :class="{
      'border-blue-600 bg-blue-50': selected,
      'border-gray-300 bg-white hover:border-gray-400': !selected,
    }"
    :aria-pressed="selected"
    @click="$emit('select')"
  >
    <!-- Radio/Checkbox Icon -->
    <div class="shrink-0">
      <Icon
        :name="
          type === 'SINGLE_CHOICE'
            ? selected
              ? 'lucide:circle-dot'
              : 'lucide:circle'
            : selected
              ? 'lucide:check-square'
              : 'lucide:square'
        "
        size="24"
        :class="{
          'text-blue-600': selected,
          'text-gray-400': !selected,
        }"
        aria-hidden="true"
      />
    </div>

    <!-- Option Text -->
    <span
      class="flex-1 text-base font-medium font-family-inter"
      :class="{
        'text-gray-900': selected,
        'text-gray-700': !selected,
      }"
    >
      {{ text }}
    </span>
  </button>
</template>
