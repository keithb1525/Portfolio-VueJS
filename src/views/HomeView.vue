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
   <h1>I just enjoy making creative solutions.</h1>
   </v-row>
   <v-row>
   <h3 id="sloText" class="fade-in-text-rotate"> {{slogan[0]}} </h3>
   </v-row>
 
</v-container>
</template>
