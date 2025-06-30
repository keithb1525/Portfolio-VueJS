<script>
import { usePortfolioStore } from '@/stores/stores';
import { mapStores } from 'pinia';

export default {
  data() {
    return {
      items: [],
      itemquery: null,
      routeLoading: true
    }
  },

  mounted() {
    this.routeLoading = true;
    
    setTimeout(() => {
      this.items = this.portfolioStore.productitems;
      this.itemquery = this.portfolioStore.productquery[0];
      this.routeLoading = false;
    }, 800);
  },

  computed: {
    ...mapStores(usePortfolioStore)
  }
}
</script>

<template>
  <!-- Loading overlay for route transitions -->
  <div v-if="routeLoading" class="loading-overlay">
    <div class="loading-container">
      <div class="spinner"></div>
      <div class="loading-text">Loading please wait</div>
    </div>
  </div>
  
  <v-container v-else>
    <v-row>
      <v-col cols="12">
        <h2>DynamoDB Requests</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        This is an example of a products table built using DynamoDB to host the data and queried as an object to the
        front end. 
        <!-- <a href="https://router.vuejs.org/guide/advanced/navigation-guards.html"
          target="_blank" aria-label="link to vue router">(see docs)</a> -->
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
      <v-card max-width="1200" width="100%" class="pa-4 mx-auto">
        <v-table>
          <thead>
            <tr>
              <th class="text-left pa-4">
                Product ID
              </th>
              <th class="text-left pa-4">
                Product Name
              </th>
              <th class="text-left pa-4">
                Stock
              </th>
              <th class="text-left pa-4">
                Sku
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.ProductID">
              <td class="pa-4">{{ item.ProductID }}</td>
              <td class="pa-4">{{ item.ProductName}}</td>
              <td class="pa-4">{{ item.Quantity }}</td>
              <td class="pa-4">#{{ item.SKU }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
    </v-row>


    <v-row>
      <v-col>
       We can also query a single item from the database and return.
      </v-col>
    </v-row>


    <v-row justify="center">
      <v-col cols="12" class="text-center">
          <v-card max-width="1200" width="100%" class="pa-4 mx-auto">
            <v-row class="py-3">
              <v-col cols="12" sm="3" class="d-flex justify-center"><v-img src="/assets/swpreview.png" max-width="200px"></v-img></v-col>
              <v-col cols="12" sm="8">
                <p class="fw-bold text-h6 mb-3">{{ itemquery.ProductName }}</p>
                <p class="mb-2"><span class="fw-bold">SKU:</span> {{ itemquery.SKU }}</p>
                <p class="mb-2"><span class="fw-bold">Quantity:</span> {{ itemquery.Quantity }}</p>
                <p class="fw-bold mt-4 mb-2">Description</p>
                <p>{{ itemquery.Description }}</p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-table {
    border-collapse: separate;
    border-spacing: 0;
}

.v-table th, .v-table td {
    vertical-align: middle;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(10, 25, 41, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.loading-text {
    color: white;
    font-size: 18px;
    font-weight: 500;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>