<template>
  <div>
    <main>
      <RouterView v-slot="{ Component }">
        <transition name="fade-fast" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <Footer/>
  </div>
</template>

<style>
main {
  padding: 30px;
  min-height: 90vh;
}
</style>