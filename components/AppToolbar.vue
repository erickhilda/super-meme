<template>
  <v-app-bar dense="" color="primary" extended="" dark>
    <v-toolbar-title>Harvest Moon</v-toolbar-title>

    <div class="flex-grow-1"></div>

    <v-btn text="" outlined="">
      Login
    </v-btn>
    <!-- v-if="$route.name !== 'index'" -->
    <template #extension>
      <v-tabs grow="" dark="" background-color="primary">
        <v-tab v-for="(route, i) in routes" :key="i" nuxt="" :to="route.to">
          {{ route.text }}
        </v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      routes: [
        { text: 'Hasil Panen', to: '/' },
        { text: 'Inventaris', to: '/farm-vile' },
        { text: 'Statistic', to: '/statistic' }
      ]
    }
  }
}
</script>
