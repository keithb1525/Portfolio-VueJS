import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import PortfolioView from '@/views/PortfolioView.vue'
import ResumeView from '@/views/ResumeView.vue'
import ContactForm from '@/views/ContactForm.vue'
import DynamoDbView from '@/views/DynamoDbView.vue'
import { usePortfolioStore } from '@/stores/stores'
import RateCalculatorView from '@/views/RateCalculatorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView},
    { path: '/portfolio', name: 'portfolio', component: PortfolioView},
    { path: '/resume', name: 'resume', component: ResumeView},
    { path: '/about', name: 'about', component: AboutView},
    { path: '/contact', name: 'contact', component: ContactForm},
    { path: '/dynamodb', name: 'dynamodb', component: DynamoDbView, beforeEnter: (to, from, next) => {
      const portfolioStore = usePortfolioStore();
      if (portfolioStore.productitems.length == 0){
            portfolioStore.populatedTables();
            portfolioStore.populateQuery();
      }
      setTimeout(() => {
        next();
        console.log("Hello after 1 seconds!"); 
      }, 1000);
    }},
    { path: '/ratecalc', name: 'dynamodb', component: RateCalculatorView, beforeEnter: (to, from, next) => {
      const portfolioStore = usePortfolioStore();
      if (portfolioStore.productitems.length == 0){
            portfolioStore.populatedTables();
            portfolioStore.populateQuery();
      }
      setTimeout(() => {
        next();
        console.log("Hello after 1 seconds!"); 
      }, 1000);
    }}
    // add loading screen for all route entry if data not loaded
  ] 
})

// add queries for languages that apply

export default router
