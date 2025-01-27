<script setup>
import { RouterLink } from 'vue-router';
defineProps(['imageURL', 'title', 'category', 'description', 'route']);
</script>

<template>
    <RouterLink :to="route">
        <v-card class="mx-auto" max-width="400">
            <v-img color="surface-variant" height="200" :src="imageURL" cover>
            </v-img>

            <v-card-text>
                <div class="font-weight-bold ms-1 mb-2">{{ title }}</div>
                <div class="ms-1 mb-2">Project Category </div>
                <div class="ms-1 mb-2">{{ description }}</div>
                 
            </v-card-text>
        </v-card>
    </RouterLink>
</template>

<style scoped>
a {
    text-decoration: none;
    color: inherit;
}
</style>
