<script setup>
import ProjectPreview from '../components/ProjectPreview.vue'
</script>
<template>
    <div class="about fade-in">
      <h1 class="text-center font-weight-bold mb-6">Portfolio Examples</h1>
      <v-row>
      <v-col cols="12" md="3">
        <ProjectPreview imageURL="/assets/project2.png" category="AWS" title="GPS Tracker" route="/portfolio/gpstracker" description="AWS Iot Service, Google Maps API, Low cost.."/>
    </v-col>
        <v-col cols="12" md="3">
        <ProjectPreview imageURL="/assets/project1.png" category="AWS" title="Asset Tracking" route="/portfolio/assettracker" description="AWS Iot, Lambda, DynamoDB, & more.."/>
    </v-col>
    <v-col cols="12" md="3">
        <ProjectPreview imageURL="/assets/project3.png" category="AWS" title="DynamoDB Example" route="/portfolio/dynamodb" description="AWS DyanmoDb, Scans & Queries, Custom data sets.."/>
    </v-col>
    <v-col cols="12" md="3">
        <ProjectPreview imageURL="/assets/project3.png" category="Resources" title="Savings Calculator" route="/portfolio/savingscalc" description="Custom data source, Vuetify"/>
    </v-col>
    <v-col cols="12" md="3">
        <ProjectPreview imageURL="/assets/project3.png" category="Resources" title="Authenticate to App" route="/portfolio/authapp" description="Authentication services"/>
    </v-col>

     <!--
    <v-col cols="12" md="3">
        <ProjectPreview imageURL="/assets/project1.png" title="Status Page Example (Health Checks)" route="/" description="coming soon..."/>
    </v-col> -->

  </v-row>
    </div>
  </template>
  
  <style>
  
  </style>
  