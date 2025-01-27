<script setup>
import { VFileUpload } from 'vuetify/labs/VFileUpload';
</script>
<script>
export default {
    data() {
        return {
            checkbox1: false,
            valid: false,
            firstname: '',
            lastname: '',
            email: '',
            emailRules: [
                value => {
                    if (value) return true

                    return 'E-mail is required.'
                },
                value => {
                    if (/.+@.+\..+/.test(value)) return true

                    return 'E-mail must be valid.'
                },
            ],
        }
    },


}
</script>

<template>

    <v-sheet class="pa-4 text-start mx-auto" elevation="12" max-width="600" rounded="lg" width="100%">

        <h2 class="text-h5 mb-6 text-center py-4">Submit a ticket</h2>

        <v-form ref="form" class="p-4">

            <v-autocomplete label="Department" :items="['DevTeam', 'IT Support', 'SBL Support',]"></v-autocomplete>

            <v-autocomplete label="Priority" :items="['Low', 'Medium', 'High']"></v-autocomplete>

            <v-row>
                <v-col cols="12">
                    <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="firstname" :rules="nameRules" label="First name"
                        required></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="lastname" :rules="nameRules" label="Last name"
                        required></v-text-field>
                </v-col>
            </v-row>
        

            <v-textarea label="Message:"></v-textarea>

            <div>Upload Documents</div>
            <v-file-upload density="comfortable" variant="comfortable"></v-file-upload>

            <div class="d-flex flex-column">
                <v-btn class="mt-4" color="success" block @click="validate">
                    Submit
                </v-btn>

            </div>

            <br>

                    <p class="mb-4 text-medium-emphasis text-body-2">
                        This form is for internal use only. If you are experiencing any issues with the form please submit a ticket via email. Alternatively 
                    </p>
        
        </v-form>

   

        <v-divider class="mb-4"></v-divider>

        <div class="text-end">
      
        </div>
    </v-sheet>

</template>
