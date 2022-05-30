<template>
  <main >
    <RouterView v-slot="{ Component }">
      <transition name="fade-fast" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
    <div>
      [Default Layout]
    </div>
  </main>
</template>