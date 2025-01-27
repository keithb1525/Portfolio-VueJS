<script setup>
import { usePortfolioStore } from '@/stores/stores';
import { mapStores } from 'pinia';

</script>

<script>

export default {
    data() {
        return {
            items: [],
            itemquery: [],
            skill: 25,
            knowledge: 33,
            power: 78,
        }
    },
    mounted() {
        this.items = this.portfolioStore.bankItems;
        // this.itemquery = this.portfolioStore.productquery[0];

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
                This is an example of a products table built using DynamoDB to host the data and queried as an object to
                the
                front end.
                This uses dynamo db's "scan" feature to return all items from the table. Before the route can be entered
                we use
                the "beforeEnter" feature from
                vue-router to add conditional rendering of the component to wait for the data to be returned from the
                API (or in
                this case the dynamoDB scan). <a href="https://router.vuejs.org/guide/advanced/navigation-guards.html"
                    target="_blank" aria-label="link to vue router">(see docs)</a>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card max-width="1200" width="100%" class="p-4">
                    <v-row class="mx-0 text-center">
                        <v-col col="12" class="p-0">
                            <h2 class="fw-bold">Personal Savings Calculator</h2>
                        </v-col>
                        <v-col cols="12" class="p-0">
                            <p>Want to see how much more you could be earning with a Leader Bank CD?</p>
                        </v-col>
                    </v-row>
                    <v-row class="mx-0">
                        <v-col col="6">
                            <p>Select the product you're interested in</p>
                            <v-select
                                :items="['4.30%', '3.25%', '2.75%', '4.10%',]"
                                variant="outlined"> APY</v-select>
                        </v-col>
                        <v-col cols="6">
                            <p>Enter an estimate for the balance</p>
                            <v-text-field  variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mx-0">
                        <v-col>
                            <p>Based on this information, you would earn <span class="fw-bold"
                                    style="color:#9f2d20">$45,788</span> with a Leader Bank CD than at the
                                average mega bank.</p>
                        </v-col>
                    </v-row>
                    <v-row class="mx-0" >
                        <v-col cols="12" md="6" class="table-col">
                            <v-table fixed-header height="300px">
                                <thead>
                                    <tr>
                                        <th class="text-left">
                                            BANK
                                        </th>
                                        <th class="text-left">
                                            APY
                                        </th>
                                        <th class="text-left">
                                            EST. Earnings
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in items" :key="item.name">
                                        <td class="fw-bold">{{ item.name }}</td>
                                        <td>{{ item.rate }}%</td>
                                        <td>{{ item.rate * 3000 }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-progress-linear v-model="power" color="#9f2d20" height="25"></v-progress-linear>
                            <div style="color:#9f2d20;font-weight:bold">Leader Bank</div>
                            <br>

                            <v-progress-linear v-model="skill" color="#ffad31" height="25">
                            
                            </v-progress-linear>
                            <div style="color:#ffad31;font-weight:bold">Mega</div>


                            <br>

                            <v-progress-linear v-model="knowledge" color="#1e5895" height="25">
                               
                            </v-progress-linear>
                            <div style="color:#1e5895;font-weight:bold">Local</div>
                            <br>

                            <v-progress-linear v-model="knowledge" color="green" height="25">
                          
                            </v-progress-linear>
                            <div style="color:#1dbf73;font-weight:bold">Digital</div>
                        </v-col>
                    </v-row>

                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>
<style lang="scss">
.table-col{
    table{
        border: solid 1px #DDE1E6;
        thead{
            background-color: #9f2d20;
            color:white;
            tr{
                th{
                    background: none !important;
                }
            }
        }
        
    }
}
   

</style>