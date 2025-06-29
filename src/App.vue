<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/navigation/NavBar.vue';
import { mapStores } from 'pinia';
import { usePortfolioStore } from '@/stores/stores'

</script>

<script>

export default {
  
computed: {
  ...mapStores( usePortfolioStore )
},

methods: {

  }
}

</script>


<template>
  <container>
  <header >
    
     <NavBar />

  </header>
  
  <div class="mx-5 my-5 main"> 

      <RouterView />

  </div>
</container>
</template>

<style>

.fade-in {
	opacity: 1;
	animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: 0.3s;
}

@keyframes fadeInOpacity {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
.fade-in-text-rotate {
	opacity: 1;
	animation-name: fadeInTextOpacity;
  animation-iteration-count: infinite;
	animation-timing-function: ease-in;
	animation-duration: 5.2s;
}

@keyframes fadeInTextOpacity {
	0% {
		opacity: 0;
	}
	15% {
		opacity: 1;
	}
  85%{
    opacity: 1;
  }
  100%{
    opacity: 0;
  }
}

.fade-out-text {
	opacity: 0;
	animation-name: fadeOutTextOpacity;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: 3s;
}

@keyframes fadeOutTextOpacity {
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}

header {
  line-height: 1.5;
  max-height: 100vh;
  padding: 0 2rem;
}

body {
  width: 100%;
  background-color: #0a1929; 
  color: white;
  margin: 0;
  padding: 0;
}

html::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
  background-size: 40px 40px;
}

.v-row {
  margin-left: 0;
  margin-right: 0;
  margin-top: 12px;
  margin-bottom: 12px;
}

.main{
  position: relative;
  top: 48px;
  margin: 0 2rem;
  padding: 1rem;
}

container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  color: white;
}

nav {
  font-size: 1.1rem;
  text-align: end;
  overflow: hidden;
  top: 0;
  width: 100%;
  z-index: 9999;
}

nav a.router-link-exact-active {
  color: var(--color-text);
  border-bottom: solid 3px;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  color: white;
  margin: 0 1rem;
  text-decoration: none;
  border-left: 1px solid var(--color-border);
}

</style>