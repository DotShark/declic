<script setup lang="ts">
const surveyStore = useSurveyStore()

const progressPercentage = computed(() => surveyStore.progressPercentage)
const modulesProgress = computed(() => surveyStore.modulesProgress)

// Calculate segment width (each module gets equal space)
const segmentWidth = computed(() => {
  const count = modulesProgress.value.length
  return count > 0 ? 100 / count : 0
})

// Get status label in French
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Complété'
    case 'in_progress':
      return 'En cours'
    case 'pending':
      return 'En attente'
    default:
      return ''
  }
}
</script>

<template>
  <div class="w-full">
    <!-- Progress Bar Container -->
    <div class="flex flex-col gap-2">
      <!-- Icons Row -->
      <div class="relative flex">
        <div
          v-for="module in modulesProgress"
          :key="`icon-${module.behavior}`"
          class="group cursor-help flex items-center justify-center"
          :style="{ width: `${segmentWidth}%` }"
        >
          <!-- Module Icon -->
          <div class="relative w-6 h-6 flex items-center justify-center">
            <Icon
              :name="module.icon"
              size="20"
              :class="{
                'text-blue-600': module.status === 'completed' || module.status === 'in_progress',
                'text-gray-400': module.status === 'pending',
              }"
              class="transition-all group-hover:scale-125"
              aria-hidden="true"
            />
          </div>

          <!-- Tooltip on Hover -->
          <div
            class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30"
          >
            <div class="bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap font-family-inter">
              <div class="flex items-center gap-2">
                <Icon :name="module.icon" size="16" aria-hidden="true" />
                <span>{{ module.name }}</span>
              </div>
              <div class="text-gray-300 text-[10px] mt-1">
                {{ getStatusLabel(module.status) }}
              </div>
              <!-- Tooltip Arrow -->
              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
                <div class="w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Segmented Progress Bar -->
      <div
        class="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        :aria-valuenow="progressPercentage"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="`Progression du questionnaire : ${progressPercentage}%`"
      >
        <!-- Background Layer: Segments -->
        <div class="absolute inset-0 flex">
          <div
            v-for="(module, index) in modulesProgress"
            :key="`bg-${module.behavior}`"
            class="relative h-full bg-gray-300"
            :style="{ width: `${segmentWidth}%` }"
          >
            <!-- Separator Line (except for last segment) -->
            <div
              v-if="index < modulesProgress.length - 1"
              class="absolute right-0 top-0 bottom-0 w-[3px] bg-white"
            />
          </div>
        </div>

        <!-- Progress Fill Overlay -->
        <div
          class="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out rounded-full"
          :style="{ width: `${progressPercentage}%` }"
        />
      </div>
    </div>
  </div>
</template>
