<template>
  <div class="confirmation-container">
    <v-card class="confirmation-card" max-width="400" width="100%">
      <v-card-text class="text-center">
        <v-icon
          color="success"
          size="96"
          class="mb-4"
        >
          mdi-check-circle
        </v-icon>
        
        <h2 class="text-h4 mb-2">Success!</h2>
        <p class="text-body-1">Your action has been completed successfully.</p>
        
        <v-btn
          color="primary"
          class="mt-6"
          @click="goBack"
        >
          Continue
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationView',
  methods: {
    goBack() {
      this.$router.push('/');
      // Alternatively: this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.confirmation-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.confirmation-card {
  padding: 40px 20px;
  background-color: white;
}
</style>