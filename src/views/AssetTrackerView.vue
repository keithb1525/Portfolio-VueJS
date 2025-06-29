<script setup>
import { usePortfolioStore } from '@/stores/stores';
import { mapStores } from 'pinia';
import assetMap from '@/components/assetMap.vue';

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
            simulationKey: 'gps-tracker-simulation-active',
            selectedAssetId: '',
            searchQuery: '',
            // Asset data array
            assets: [
                {
                    id: 'ITSM-L-001',
                    name: 'Dell Latitude 7420',
                    os: 'Windows 11 Pro 22H2',
                    serial: 'SN-DL7420-58392',
                    status: 'Deployed',
                    department: 'IT Department',
                    lastUpdated: '2024-05-15 09:45 AM',
                    cpu: 'Intel Core i7-1185G7',
                    memory: '16GB DDR4',
                    diskUsage: '256GB / 512GB SSD',
                    gpu: 'Intel Iris Xe Graphics',
                    appsInstalled: 42,
                    latitude: 40.7128,
                    longitude: -74.0060 // New York
                },
                {
                    id: 'ITSM-S-002',
                    name: 'Dell PowerEdge R740',
                    os: 'VMware ESXi 7.0.3',
                    serial: 'SN-PE740-29471',
                    status: 'Operational',
                    department: 'Data Center A',
                    lastUpdated: '2024-05-15 10:30 AM',
                    cpu: 'Intel Xeon Gold 6248R (2x)',
                    memory: '384GB DDR4',
                    diskUsage: '12.4TB / 16TB',
                    gpu: 'N/A',
                    appsInstalled: 'N/A',
                    latitude: 37.7749,
                    longitude: -122.4194 // San Francisco
                },
                {
                    id: 'ITSM-N-003',
                    name: 'Cisco Catalyst 9300',
                    os: 'IOS XE 17.6.3',
                    serial: 'FOC23487ZXC',
                    status: 'Maintenance',
                    department: 'Network Room B',
                    lastUpdated: '2024-05-14 11:15 AM',
                    cpu: 'Quad-core ARM',
                    memory: '16GB DRAM',
                    diskUsage: '8GB / 16GB Flash',
                    gpu: 'N/A',
                    appsInstalled: 'N/A',
                    latitude: 41.8781,
                    longitude: -87.6298 // Chicago
                },
                {
                    id: 'ITSM-P-004',
                    name: 'HP LaserJet Enterprise M507',
                    os: 'Firmware 2.92.5',
                    serial: 'CNBB234971',
                    status: 'Low Supplies',
                    department: 'Marketing Department',
                    lastUpdated: '2024-05-14 03:20 PM',
                    cpu: 'ARM Cortex-A9',
                    memory: '512MB',
                    diskUsage: 'N/A',
                    gpu: 'N/A',
                    appsInstalled: 'N/A',
                    latitude: 34.0522,
                    longitude: -118.2437 // Los Angeles
                },
                {
                    id: 'ITSM-M-005',
                    name: 'iPhone 13 Pro',
                    os: 'iOS 17.4.1',
                    serial: 'IMEI-3538294710',
                    status: 'Deployed',
                    department: 'Sales Department',
                    lastUpdated: '2024-05-16 08:15 AM',
                    cpu: 'Apple A15 Bionic',
                    memory: '6GB',
                    diskUsage: '187GB / 256GB',
                    gpu: 'Apple GPU (5-core)',
                    appsInstalled: 78,
                    latitude: 29.7604,
                    longitude: -95.3698 // Houston
                },
                {
                    id: 'ITSM-L-006',
                    name: 'MacBook Pro 16"',
                    os: 'macOS 14.4.1',
                    serial: 'C02G294ZQMN1',
                    status: 'Pending Setup',
                    department: 'IT Inventory',
                    lastUpdated: '2024-05-13 02:45 PM',
                    cpu: 'Apple M2 Pro',
                    memory: '32GB',
                    diskUsage: '0GB / 1TB SSD',
                    gpu: '19-core GPU',
                    appsInstalled: 0,
                    latitude: 33.4484,
                    longitude: -112.0740 // Phoenix
                },
                {
                    id: 'ITSM-S-007',
                    name: 'AWS EC2 Instance',
                    os: 'Amazon Linux 2023',
                    serial: 'i-0a1b2c3d4e5f67890',
                    status: 'Operational',
                    department: 'AWS us-east-1',
                    lastUpdated: '2024-05-16 12:10 PM',
                    cpu: '4 vCPU (c5.xlarge)',
                    memory: '8GB',
                    diskUsage: '45GB / 100GB EBS',
                    gpu: 'None',
                    appsInstalled: 12,
                    latitude: 39.9526,
                    longitude: -75.1652 // Philadelphia
                },
                {
                    id: 'ITSM-N-008',
                    name: 'Palo Alto PA-3260',
                    os: 'PAN-OS 10.2.3',
                    serial: 'PA-3260-00487239',
                    status: 'Needs Attention',
                    department: 'Network Core',
                    lastUpdated: '2024-05-15 07:30 PM',
                    cpu: 'Multi-core Security Processor',
                    memory: '16GB',
                    diskUsage: '240GB / 240GB SSD',
                    gpu: 'N/A',
                    appsInstalled: 'N/A',
                    latitude: 32.7157,
                    longitude: -117.1611 // San Diego
                }
            ]
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
            
            // Set default selected asset to first item in assets array
            if (this.assets.length > 0) {
                this.selectedAssetId = this.assets[0].id;
            }
            
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
        selectedAsset() {
            return this.assets.find(asset => asset.id === this.selectedAssetId) || null;
        },
        filteredAssets() {
            if (!this.searchQuery) return this.assets;
            const query = this.searchQuery.toLowerCase();
            return this.assets.filter(asset => 
                asset.id.toLowerCase().includes(query) || 
                asset.name.toLowerCase().includes(query)
            );
        }
    },
    methods: {
        selectAsset(id) {
            this.selectedAssetId = id;
            // Scroll to the asset details section
            this.$nextTick(() => {
                document.querySelector('.asset-details')?.scrollIntoView({ behavior: 'smooth' });
            });
            // Update map with the selected asset
            const asset = this.assets.find(a => a.id === id);
            if (asset) {
                this.updateMap(asset);
            }
        },
        onAssetSelected() {
            // Update map with the selected asset from autocomplete
            if (this.selectedAssetId) {
                const asset = this.assets.find(a => a.id === this.selectedAssetId);
                if (asset) {
                    this.updateMap(asset);
                }
            }
        },
        checkSimulationComplete() {
            // If all intervals are cleared except the timeout
            if (this.intervalIds.length <= 1) {
                this.isSimulating = false;
            }
        },
        updateMap(asset) {
            // Clear any existing intervals
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
            let n = asset;
            let str = JSON.stringify(n);
            device.publish('assetTrackingMap', str);
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

    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1 class="text-h4 mb-6">Asset Tracking System</h1>
      </v-col>
    </v-row>
      <v-row justify="center">
      <v-col cols="12" class="text-center">
        Select an asset to view the details. <br>
        <span class="fw-bold">Note:</span> This uses template data populated from an assumed storage of device data (in this example DynamoDB). For updating the stored information we use a combination of IOT services and lambda functions.

      </v-col>
    </v-row>
    
    <v-row justify="center">
      <v-col cols="12" class="text-center">
      <v-card max-width="1200" width="100%" class="pa-4 mx-auto card-shadow">
        <v-table>
          <thead>
            <tr>
              <th class="text-center pa-4">
                Asset ID
              </th>
              <th class="text-center pa-4">
                Asset Name
              </th>
              <th class="text-center pa-4">
                OS/Firmware
              </th>
              <th class="text-center pa-4">
                Serial Number
              </th>
              <th class="text-center pa-4">
                Status
              </th>
              <th class="text-center pa-4">
                Department
              </th>
              <th class="text-center pa-4">
                Last Updated
              </th>
            </tr>
          </thead>
        <tbody>
          <tr v-for="asset in assets" :key="asset.id" @click="selectAsset(asset.id)" class="asset-row">
            <td class="pa-4">{{ asset.id }}</td>
            <td class="pa-4">{{ asset.name }}</td>
            <td class="pa-4">{{ asset.os }}</td>
            <td class="pa-4">{{ asset.serial }}</td>
            <td class="pa-4">{{ asset.status }}</td>
            <td class="pa-4">{{ asset.department }}</td>
            <td class="pa-4">{{ asset.lastUpdated }}</td>
          </tr>
        </tbody>

        </v-table>
      </v-card>
    </v-col>
    </v-row>
    
    <!-- Asset Filter Section -->
    <v-row justify="center" class="mt-6">
      <v-col cols="12" class="text-center">
        <v-card max-width="1200" width="100%" class="pa-4 mx-auto card-shadow">
          <div class="mb-4">
            <h3 class="mb-2 pa-4">Asset Details</h3>
            <div class="d-flex align-center pa-4 mx-4">
              <div class="me-4">Search Assets</div>
              <v-autocomplete
                v-model="selectedAssetId"
                :items="filteredAssets"
                item-title="name"
                item-value="id"
                :search-input.sync="searchQuery"
                variant="outlined"
                density="compact"
                class="asset-search"
                style="max-width: 300px"
                placeholder="Type to search assets"
                clearable
                @update:search="searchQuery = $event"
                @update:model-value="onAssetSelected"
                hide-selected
                hide-details
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :title="null">
                    <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.raw.id }}</v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </div>
          </div>
          
          <div v-if="selectedAsset" class="asset-details">
            <v-row>
              <v-col cols="12" md="6">
                <v-row dense>
                  <v-col cols="6">
                    <v-list density="compact">
                      <v-list-item>
                        <v-list-item-title>Asset ID</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedAsset.id }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Name</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedAsset.name }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>OS/Firmware</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedAsset.os }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Serial Number</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedAsset.serial }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>CPU</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedAsset.cpu }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="6">
                    <v-list density="compact">
                      <v-list-item>
                        <v-list-item-title>Memory</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedAsset.memory }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Disk Usage</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedAsset.diskUsage }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>GPU</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedAsset.gpu }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Apps Installed</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedAsset.appsInstalled }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Latitude</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedAsset.latitude }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Longitude</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedAsset.longitude }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <assetMap></assetMap>
              </v-col>
            </v-row>
          </div>
          <div v-else class="text-center pa-4">
            <p>Select an asset from the dropdown or table to view details</p>
          </div>
        </v-card>
      </v-col>
    </v-row>
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

.max-width-300 {
    max-width: 300px;
}

.w-100 {
    width: 100%;
}

.asset-details {
    text-align: left;
}

.asset-row {
    cursor: pointer;
}

.asset-row:hover {
    background-color: rgba(0, 0, 0, 0.04);
}

.card-shadow {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>