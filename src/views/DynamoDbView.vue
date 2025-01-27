<script setup>
import { usePortfolioStore } from '@/stores/stores';
import { mapStores } from 'pinia';

</script>

<script>
// let awsConfig = {
//     region: 'us-east-1',
//     endpoint: 'http://dynamodb.us-east-1.amazonaws.com',
//     accessKeyId: import.meta.env.VITE_APP_DB_ACCESS_KEY, 
//     secretAccessKey: import.meta.env.VITE_APP_DB_SECRETACCESS_KEY
// };

// AWS.config.update(awsConfig);
// let docClient = new AWS.DynamoDB.DocumentClient();


export default {
  data() {
    return {
      items: [],
      itemquery: [],
    }
  },
  mounted() {
    this.items = this.portfolioStore.productitems;
    this.itemquery = this.portfolioStore.productquery[0];

  },

  computed: {
    ...mapStores(usePortfolioStore)
  },


}
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        This is an example of a products table built using DynamoDB to host the data and queried as an object to the
        front end.
        This uses dynamo db's "scan" feature to return all items from the table. Before the route can be entered we use
        the "beforeEnter" feature from
        vue-router to add conditional rendering of the component to wait for the data to be returned from the API (or in
        this case the dynamoDB scan). <a href="https://router.vuejs.org/guide/advanced/navigation-guards.html"
          target="_blank" aria-label="link to vue router">(see docs)</a>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
      <v-card max-width="1200" width="100%">
        <v-table class="px-5 py-5">
          <thead>
            <tr>
              <th class="text-left">
                Product ID
              </th>
              <th class="text-left">
                Product Name
              </th>
              <th class="text-left">
                Stock
              </th>
              <th class="text-left">
                Sku
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.ProductID">
              <td>{{ item.ProductID }}</td>
              <td>{{ item.ProductName }}</td>
              <td>{{ item.Quantity}}</td>
              <td>#{{ item.SKU }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
    </v-row>


    <v-row>
      <v-col>
       We can also query a single item from the database and return <a href="https://router.vuejs.org/guide/advanced/navigation-guards.html"
          target="_blank" aria-label="link to vue router">(see docs)</a>
      </v-col>
    </v-row>


    <v-row>
      <v-col>
          <v-card max-width="1200" width="100%">
            <v-row class="py-2">
              <v-col cols="6" class="justify-content-center d-flex"><v-img src="assets/swpreview.png" max-width="200px"></v-img></v-col>
              <v-col cols="6">
                <p class="fw-bold">{{ itemquery.ProductName }}</p>
                <p><span class="fw-bold">SKU:</span> {{ itemquery.SKU }}</p>
                <p><span class="fw-bold">Quantity:</span> {{ itemquery.Quantity }}</p>
                <p>Description</p>
                <p>{{ itemquery.Description }}</p>
              </v-col>
           

              


            </v-row>
          </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>
