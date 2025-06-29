import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import PortfolioView from '@/views/PortfolioView.vue'
import ResumeView from '@/views/ResumeView.vue'
import ContactForm from '@/views/ContactForm.vue'
import DynamoDbView from '@/views/DynamoDbView.vue'
import { usePortfolioStore } from '@/stores/stores'
import { useAuthStore } from '@/stores/authStore'
import RateCalculatorView from '@/views/RateCalculatorView.vue'
import GpsTrackerView from '@/views/GpsTrackerView.vue'
import AssetTrackerViewVue from '@/views/AssetTrackerView.vue'
import LoginView from '@/views/LoginView.vue'
import ConfirmationViewVue from '@/views/ConfirmationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView},
    { path: '/login', name: 'login', component: LoginView },
    { 
      path: '/confirmation', 
      name: 'confirmation', 
      component: ConfirmationViewVue,
      meta: { requiresAuth: true }
    },
    { path: '/portfolio', name: 'portfolio', component: PortfolioView},
    { path: '/resume', name: 'resume', component: ResumeView},
    { path: '/about', name: 'about', component: AboutView},
    { path: '/contact', name: 'contact', component: ContactForm},
    { path: '/portfolio/gpstracker', name: 'gpstracker', component: GpsTrackerView},
    { path: '/portfolio/assettracker', name: 'assettracker', component: AssetTrackerViewVue},


    { path: '/portfolio/dynamodb', name: 'dynamodb', component: DynamoDbView, beforeEnter: (to, from, next) => {
      const portfolioStore = usePortfolioStore();
      if (portfolioStore.productitems.length == 0){
            portfolioStore.populatedTables();
            portfolioStore.populateQuery();
      }
      setTimeout(() => {
        next();
        // console.log("Hello after 1 seconds!"); 
      }, 1000);
    }},
    { path: '/portfolio/savingscalc', name: 'ratecalc', component: RateCalculatorView, beforeEnter: (to, from, next) => {
      const portfolioStore = usePortfolioStore();
      if (portfolioStore.productitems.length == 0){
            portfolioStore.populatedTables();
            portfolioStore.populateQuery();
      }
      setTimeout(() => {
        next();
        // console.log("Hello after 1 seconds!"); 
      }, 1000);
    }}
    // add loading screen for all route entry if data not loaded
  ] 
})

// Navigation guard to check authentication for protected routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    // Check if user is authenticated
    if (authStore.checkAuth()) {
      // User is authenticated, allow access
      next();
    } else {
      // User is not authenticated, redirect to login
      next('/login');
    }
  } else {
    // Route doesn't require authentication, allow access
    next();
  }
})

export default router
