<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/navigation/NavBar.vue';
import { mapStores } from 'pinia';
import { usePortfolioStore } from '@/stores/stores'
import AWS from 'aws-sdk';


</script>

<script>
let awsConfig = {
  region: 'us-east-1',
  endpoint: 'http://dynamodb.us-east-1.amazonaws.com',
  accessKeyId: import.meta.env.VITE_APP_DB_ACCESS_KEY, 
  secretAccessKey: import.meta.env.VITE_APP_DB_SECRETACCESS_KEY
};

AWS.config.update(awsConfig);
let docClient = new AWS.DynamoDB.DocumentClient();

export default {
  
computed: {
  ...mapStores( usePortfolioStore )
},

methods:{
  populateTables(){
    let n = [];
    let params = {
    TableName: "WebsiteProducts",
    };
    docClient.scan( params, function (err, data) {
        if (err) {
          console.log("Error", err);
          return null;
        } else {
          console.log("Success", data);
          
          let response = data.Items;

          for(let i = 0; i < response.length; i++) {
            n.push(response[i])
          }

        }
      });
      this.portfolioStore.productitems = n;

  }
},

beforeMount() {
  // this.populateTables();
}
}


</script>


<template>
  <container>
  <header >
    
     <NavBar />

  </header>
  
  <div class="mx-5 my-5 main "> 

      <RouterView />

  </div>
</container>
</template>

<style >

.fade-in {
	opacity: 1;
	animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: 0.3s;
}

@keyframes fadeInOpacity {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
.fade-in-text-rotate {
	opacity: 1;
	animation-name: fadeInTextOpacity;
  animation-iteration-count: infinite;
	animation-timing-function: ease-in;
	animation-duration: 5.2s;
}

@keyframes fadeInTextOpacity {
	0% {
		opacity: 0;
	}
	15% {
		opacity: 1;
	}
  85%{
    opacity: 1;
  }
  100%{
    opacity: 0;
  }
}

.fade-out-text {
	opacity: 0;
	animation-name: fadeOutTextOpacity;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: 3s;
}

@keyframes fadeOutTextOpacity {
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

body {
  width: 100%;
  background-color: #b7b7b7; 
}

.v-row {
  margin-left: 0;
  margin-right: 0;
  margin-top: 12px;
  margin-bottom: 12px;

}

.main{
  position: relative;
    top: 48px;
}


nav {
  font-size: 1.1rem;
  text-align: end;
  overflow: hidden;
  top: 0;
  width: 100%;
  z-index: 9999;
}

nav a.router-link-exact-active {
  color: var(--color-text);
  border-bottom: solid 3px;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {

  color: white;
  margin: 0 1rem;
  text-decoration: none;
  border-left: 1px solid var(--color-border);
}


</style>
