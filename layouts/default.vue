<template>
  <v-app id="inspire">
    <v-content>
      <app-toolbar />
      <v-container fluid="" fill-height>
        <v-layout justify-center align-start="">
          <v-flex>
            <nuxt-child />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import AppToolbar from '~/components/AppToolbar'

export default {
  components: { AppToolbar },
  data() {
    return {
      drawer: null
    }
  }
}
</script>
