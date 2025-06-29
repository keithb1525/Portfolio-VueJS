<template>
  <div class="login-container">
    <v-card class="login-card" max-width="400" width="100%">
      <v-card-title class="text-center">Login</v-card-title>
      
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
            prepend-icon="mdi-email"
          ></v-text-field>
          
          <v-text-field
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            required
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          
          <div class="d-flex align-center justify-space-between mb-4">
            <v-checkbox v-model="rememberMe" label="Remember me" hide-details></v-checkbox>
            <a href="#" class="text-caption">Forgot password?</a>
          </div>
          
          <v-btn
            type="submit"
            color="primary"
            block
            :loading="loading"
          >
            Login
          </v-btn>
        </v-form>
      </v-card-text>
      
      <v-card-text class="text-center">
        <p class="text-caption">
          Don't have an account? <a href="#">Sign up</a>
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      rememberMe: false,
      loading: false
    }
  },
  methods: {
    login() {
      this.loading = true;
      
      // Simulate API call
      setTimeout(() => {
        // Handle login logic here
        console.log('Login attempt with:', this.email);
        
        // Use auth store to set authenticated state
        const { useAuthStore } = require('@/stores/authStore');
        const authStore = useAuthStore();
        authStore.login(this.email, this.password);
        
        this.loading = false;
        
        // Navigate to confirmation page on success
        this.$router.push('/confirmation');
      }, 1000);
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  padding: 20px;
  background-color: white;
}
</style>