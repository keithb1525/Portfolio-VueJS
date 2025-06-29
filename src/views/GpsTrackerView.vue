<script setup>
import { usePortfolioStore } from '@/stores/stores';
import { mapStores } from 'pinia';
import googleMap from '@/components/googleMap.vue';

</script>
<script>

export default {
    data() {
        return {
            sim1: [],
            sim2: [],
            loading: false,
            routeLoading: true,
            intervalIds: [],
            isSimulating: false,
            // Use local storage to persist simulation state
            simulationKey: 'gps-tracker-simulation-active'
        }
    },
    mounted() {
        // Set initial loading state
        this.routeLoading = true;
        
        // Reset simulation state on mount to prevent button showing as "Simulating..." by default
        localStorage.setItem(this.simulationKey, 'false');
        this.loading = false;
        
        // Simulate loading delay when switching routes
        setTimeout(() => {
            this.sim1 = this.portfolioStore.path1;
            this.sim2 = this.portfolioStore.path2;
            
            // Hide loading spinner
            this.routeLoading = false;
        }, 800);
    },
    beforeUnmount() {
        // Clear all intervals when navigating away
        this.intervalIds.forEach(id => clearInterval(id));
        this.intervalIds = [];
    },
    computed: {
        ...mapStores(usePortfolioStore),
    },
    methods: {
        checkSimulationComplete() {
            // If all intervals are cleared except the timeout
            if (this.intervalIds.length <= 1) {
                this.isSimulating = false;
            }
        },
        updateMap() {
            // Clear any existing intervals
            this.intervalIds.forEach(id => clearInterval(id));
            this.intervalIds = [];

            const AwsIot = require('aws-iot-device-sdk');
            const clientID = 'webapp:' + new Date().getTime(); //needs to be unique
            const device = AwsIot.device({ //device connection options
                clientId: clientID,
                host: import.meta.env.VITE_APP_HOST, //iot Host here <hostid>.iot.us-east-1.amazonaws.com
                protocol: 'wss', //protocol e.g.  < 'wss' >
                accessKeyId: import.meta.env.VITE_APP_ACCESS_KEY, //access key id here (from iam user)
                secretKey: import.meta.env.VITE_APP_SECRETACCESS_KEY, //secret access key id here (from iam user)
                //sessionToken: AWS.config.credentials.sessionToken,
            });
            let i = 0;
            let n = this.sim1;
            const intervalId1 = setInterval(() => {
                if (i >= n.length - 1) {
                    i = 0;
                    clearInterval(intervalId1);
                    // Check if both intervals are complete
                    this.checkSimulationComplete();
                }
                else {
                    let str = JSON.stringify(n[i]);
                    device.publish('PortfolioMap', str);
                    i++
                }
            }, 20);
            this.intervalIds.push(intervalId1);

            let p = 0;
            let d = this.sim2;
            const intervalId2 = setInterval(() => {
                if (p >= d.length - 1) {
                    p = 0;
                    clearInterval(intervalId2);
                    // Check if both intervals are complete
                    this.checkSimulationComplete();
                }
                else {
                    let str = JSON.stringify(d[p]);
                    device.publish('PortfolioMap', str);
                    p++
                }
            }, 20);
            this.intervalIds.push(intervalId2);
        },
        load() {
            this.loading = true;
            this.isSimulating = true;
            // Store simulation state in localStorage
            localStorage.setItem(this.simulationKey, 'true');
            this.updateMap();
            const timeoutId = setTimeout(() => {
                this.loading = false;
                this.isSimulating = false;
                // Reset simulation state
                localStorage.setItem(this.simulationKey, 'false');
            }, 10000); // Reduced from 300000 (5 minutes) to 10 seconds
            this.intervalIds.push(timeoutId);
        },

    },
}

</script>

<template>
    <div>
        <!-- Loading overlay for route transitions -->
        <div v-if="routeLoading" class="loading-overlay">
            <div class="loading-container">
                <div class="spinner"></div>
                <div class="loading-text">Loading please wait</div>
            </div>
        </div>
        
        <v-container v-else>
            <v-row>
                <div class="col-12">
                    <h2>GPS Tracker</h2>
                </div>
                <div class="col-12">
                    <p>This GPS tracker is a low cost solution that uses AWS IoT and Google Maps API to update markers
                        (trackers) to display the current position
                        of a device. Click the "Simulate" button below to view an example. </p>
                </div>
            </v-row>
            <v-row>
                <v-btn class="flex-grow-1" height="48" color="green" @click="load" :disabled="loading || isSimulating">
                    {{ loading ? 'Simulating...' : 'Simulate' }}
                </v-btn>
            </v-row>
            <googleMap></googleMap>
        </v-container>

         <!-- <v-row justify="center">
      <v-col cols="12" class="text-center">
      <v-card max-width="1200" width="100%" class="pa-4 mx-auto">
        <v-table>
          <thead>
            <tr>
              <th class="text-left pa-4">
                Asset ID
              </th>
              <th class="text-left pa-4">
                Asset Name
              </th>
              <th class="text-left pa-4">
                Status
              </th>
              <th class="text-left pa-4">
                Location
              </th>
              <th class="text-left pa-4">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>
             Asset tracking data will appear here 
          </tbody>
        </v-table>
      </v-card>
    </v-col>
    </v-row> -->
    </div>
</template>

<style scoped>
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