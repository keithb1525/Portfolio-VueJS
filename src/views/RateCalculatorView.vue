<script setup>
import { usePortfolioStore } from '@/stores/stores';
import { mapStores } from 'pinia';
</script>

<script>

export default {
    data() {
        return {
            items: [],
            selected: { text: "3 Month CD - 4.50%", val: 4.5, term: 3 },
            itemquery: [],
            rates: [
                { text: "3 Month CD - 4.50%", val: 4.5, term: 3 },
                { text: "6 Months CD - 4.50%", val: 4.5, term: 6 },
                { text: "12 Months CD - 3.75%", val: 3.75, term: 12 },
                { text: "18 Months CD - 1.5%", val: 1.5, term: 18 },
            ],
            principal: 25000,
            totalEarn: 0,
            leader: 75,
            bank1: 53,
            bank2: 45,
            bank3: 67,
        }
    },
    mounted() {
        this.items = this.portfolioStore.bankItems;
    },

    computed: {
        ...mapStores(usePortfolioStore),
    },

    methods: {

        calcEarn(rate, upe) {
            let t = this.selected.term / 12;
            let r = rate / 100;
            let p = this.principal;
            let n = 12;
            let base = 1 + (r / n);
            let exponent = n * t;
            let a = p * Math.pow(base, exponent);
            let ab = (a - p).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
            if (upe > 0) {
                this.totalEarn = ab;

            }
            return ab
        },

        updateGraph() {
            let total = parseFloat(this.totalEarn.replace(/,/g, "")) * 1.35;
            let lead = parseFloat(this.totalEarn.replace(/,/g, ""));
            let mega = parseFloat(document.getElementById("Mega").textContent.replace(/[\$,]/g, ""));
            let local = parseFloat(document.getElementById("Local").textContent.replace(/[\$,]/g, ""));
            let digi = parseFloat(document.getElementById("Digital").textContent.replace(/[\$,]/g, ""));

            this.leader = lead / total * 100;
            this.bank1 = mega / total * 100;
            this.bank2 = local / total * 100;
            this.bank3 = digi / total * 100;


        }


    }
}
</script>

<template>
    <v-container>
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
                        <v-col col="6" class="rate-select">
                            <p>Select the product you're interested in</p>
                            <v-select :items="rates" item-title="text" item-value="text" v-model="selected"
                                variant="outlined" @update:model-value="updateGraph()" return-object></v-select>
                        </v-col>
                        <v-col cols="6">
                            <p>Enter an estimate for the balance</p>
                            <v-text-field prefix="$" v-model="principal" type="number" variant="outlined"
                                hide-spin-buttons @input="updateGraph()"></v-text-field>

                        </v-col>
                    </v-row>
                    <v-row class="mx-0">
                        <v-col>
                            <p>Based on this information, you would earn <span class="fw-bold" style="color:#9f2d20">${{
                                totalEarn }}</span> with a Leader Bank CD than at the
                                average mega bank.</p>
                        </v-col>
                    </v-row>
                    <v-row class="mx-0">
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
                                    <tr>
                                        <td class="fw-bold">Leader Bank</td>
                                        <td>{{ selected.val }}%</td>
                                        <td>${{ calcEarn(selected.val, 1) }}</td>
                                    </tr>
                                    <tr v-for="(item, index) in items" :key="item.name">
                                        <td class="fw-bold">{{ item.name }}</td>
                                        <td>{{ item.rate }}%</td>
                                        <td v-bind:id="item.name">${{ calcEarn(item.rate) }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-progress-linear v-model="leader" color="#9f2d20" height="25"></v-progress-linear>
                            <div style="color:#9f2d20;font-weight:bold">Leader Bank</div>
                            <br>

                            <v-progress-linear v-model="bank1" color="#ffad31" height="25">

                            </v-progress-linear>
                            <div style="color:#ffad31;font-weight:bold">Mega</div>


                            <br>

                            <v-progress-linear v-model="bank2" color="#1e5895" height="25">

                            </v-progress-linear>
                            <div style="color:#1e5895;font-weight:bold">Local</div>
                            <br>

                            <v-progress-linear v-model="bank3" color="green" height="25">

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
.rate-select {
    .v-field__input {
        width: unset !important;
    }
}

.v-progress-linear__determinate {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
}

.table-col {
    table {
        border: solid 1px #DDE1E6;
        border-radius: 10px;

        thead {
            background-color: #9f2d20;
            color: white;

            tr {
                th {
                    background: none !important;
                }
            }
        }

        th:first-of-type {
            border-top-left-radius: 10px;
        }

        th:last-of-type {
            border-top-right-radius: 10px;
        }

        tr:last-of-type td:first-of-type {
            border-bottom-left-radius: 10px;
        }

        tr:last-of-type td:last-of-type {
            border-bottom-right-radius: 10px;
        }
    }
}
</style>