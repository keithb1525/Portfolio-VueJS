<script>

export default {
  data(){
    return {
      slogan: ["'Creative problem solver'", "'Innovative'", "'A team player'"]
    }
  },
  mounted() {
    this.rotateText()
  },
  methods:{
    rotateText(){
      window.setInterval(()=>{
        const first = this.slogan.shift();
        this.slogan = this.slogan.concat(first);
    }, 5200);
    }
  }

}

  

</script>

<template>
<v-container>
  <v-row class="fade-in text-center">
    <p>Hello World, my name is Keith.</p>
  </v-row>
   <v-row>
   <h1>I enjoy the process of making creative problem-solving solutions.</h1>
   </v-row>
   <v-row>
   <h3 id="sloText" class="fade-in-text-rotate"> {{slogan[0]}} </h3>
   </v-row>
   
   <v-row class="mt-8 justify-center">
     <v-col cols="12" class="text-center mb-4">
       <v-avatar size="300" class="profile-avatar">
         <v-img src="/assets/IMG_1452.jpg" alt="Profile Headshot"></v-img>
       </v-avatar>
     </v-col>
   </v-row>
   
   <v-row>
     <v-col>
       <h2 class="mb-4">About Me</h2>
       <p class="about-text">
         Dynamic and detail-oriented Software Developer with 5 years of experience in creating innovative web applications and enhancing user experiences through effective content management solutions. Proven expertise in migrating complex CMS platforms with the successful transition of leaderbank's website from WordPress to Drupal, which resulted in improved customization and user interface design using Vue.js. Skilled in developing real-time applications, such as the Shuttle Tracker for Erickson Living, leveraging APIs from Google Maps and AWS to deliver live GPS tracking across multiple retirement communities. Proficient in a diverse range of technologies including JavaScript, React.js, Vue.js, AWS, SQL, and .NET, with a strong foundation in API-based development and containerization using Podman and Docker. Committed to continuous learning and applying the latest industry trends to deliver high-quality software solutions.
       </p>
     </v-col>
   </v-row>
 
</v-container>
</template>

<style scoped>
.about-text {
  line-height: 1.6;
  max-width: 1000px;
}

.profile-avatar {
  border: 3px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>