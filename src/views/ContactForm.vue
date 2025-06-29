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
            rating: 0,
            feedback: '',
            feedbackType: '',
            submitted: false,
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
    methods: {
        validate() {
            if (this.$refs.form.validate()) {
                // Form validation logic would go here
                // In a real app, you would submit to a server here
                this.submitted = true;
            }
        },
        resetForm() {
            // Just reset the form data manually instead of using ref
            this.firstname = '';
            this.lastname = '';
            this.email = '';
            this.rating = 0;
            this.feedback = '';
            this.feedbackType = '';
            this.submitted = false;
        }
    }
}
</script>

<template>
    <h2 class="text-h4 mb-6 text-center py-4 font-weight-bold">Website Feedback</h2>
    
    <v-sheet class="pa-4 text-start mx-auto" elevation="12" max-width="600" rounded="lg" width="100%">
        <!-- Thank you screen -->
        <div v-if="submitted" class="text-center py-8">
            <v-icon icon="mdi-check-circle" color="success" size="x-large" class="mb-4"></v-icon>
            <h2 class="text-h4 mb-4">Thank You!</h2>
            <p class="mb-6">Your feedback has been submitted successfully. We appreciate your input!</p>
            <v-btn color="primary" @click="resetForm">Submit Another Response</v-btn>
        </div>

        <!-- Feedback form -->
        <div v-else>
            <v-form ref="form" class="p-4">
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="firstname" label="First name"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="lastname" label="Last name"></v-text-field>
                    </v-col>
                </v-row>

                <v-select v-model="feedbackType" label="What are you providing feedback about?" 
                    :items="['Website Design', 'Content', 'User Experience', 'Performance', 'Other']">
                </v-select>

                <div class="mb-2">How would you rate your experience?</div>
                <v-rating v-model="rating" color="amber" hover></v-rating>

                <v-textarea v-model="feedback" label="Your Feedback:" placeholder="Please share your thoughts, suggestions, or concerns"></v-textarea>

                <div class="d-flex flex-column">
                    <v-btn class="mt-4" color="primary" block @click="validate">
                        Submit Feedback
                    </v-btn>
                </div>

                <br>

                <p class="mb-4 text-medium-emphasis text-body-2">
                    Thank you for taking the time to provide feedback. Your input helps us improve our website and services.
                </p>
            </v-form>
        </div>

        <v-divider class="mb-4"></v-divider>

        <div class="text-end">
        </div>
    </v-sheet>
</template>