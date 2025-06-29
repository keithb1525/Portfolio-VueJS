import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      isAuthenticated: false,
      user: null
    }
  },
  actions: {
    login(email, password) {
      // In a real app, you would validate credentials with an API
      // This is just a simple simulation
      this.isAuthenticated = true;
      this.user = { email };
      
      // Store auth state in localStorage to persist between page refreshes
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
    },
    
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      
      // Clear auth state from localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
    },
    
    checkAuth() {
      // Check if user is authenticated from localStorage
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      const email = localStorage.getItem('userEmail');
      
      if (isAuth && email) {
        this.isAuthenticated = true;
        this.user = { email };
        return true;
      }
      
      return false;
    }
  }
})