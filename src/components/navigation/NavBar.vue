<script setup>
import { RouterLink } from 'vue-router'

</script>

<template>
      <nav>
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/portfolio" class="nav-link">Portfolio</RouterLink>
        <RouterLink to="/resume" class="nav-link">Resume</RouterLink>
        <!-- <RouterLink to="/contact" class="nav-link">Feedback</RouterLink> -->
      </nav>
</template>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
}

.nav-link {
  position: relative;
  padding: 0.5rem;
  text-decoration: none;
  color: white;
  transition: color 0.3s ease;
  font-weight: bold;
}

.nav-link:hover {
  color: #0056b3; /* More readable blue color */
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #0056b3;
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.router-link-active::after {
  width: 100%;
}

.router-link-active {
  color: #0056b3;
  font-weight: 600;
}
</style>