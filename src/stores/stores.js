import { defineStore } from 'pinia'
import AWS from 'aws-sdk';
let awsConfig = {
  region: 'us-east-1',
  endpoint: 'http://dynamodb.us-east-1.amazonaws.com',
  accessKeyId: import.meta.env.VITE_APP_DB_ACCESS_KEY, 
  secretAccessKey: import.meta.env.VITE_APP_DB_SECRETACCESS_KEY
};

AWS.config.update(awsConfig);
let docClient = new AWS.DynamoDB.DocumentClient();


export const usePortfolioStore = defineStore('portfolio', {

  state: () =>{
    return {
      productitems: [],
      productquery: [],
      bankItems:[
        {
          name: "Mega",
          rate: 3.25
        },
        {
          name: "Local",
          rate: 2.75
        },
        {name: "Digital",
          rate: 4.1
        },
      ]
    }
  },
  actions:{
    populatedTables(){

      let n = [];
      let params = {
      TableName: "WebsiteProducts",
      };
      docClient.scan( params, function (err, data) {
          if (err) {
            console.log("Error", err);
            return null;
          } else {
            let response = data.Items;
  
            for(let i = 0; i < response.length; i++) {
              n.push(response[i])
            }
  
          }
        });
        this.productitems = n;
  
    },
    populateQuery(){
      let i = [];
      var params = {
        TableName: "WebsiteProducts",
        Key: {
            "ProductID": 3
        }
    };
     docClient.get(params, function(err, data) {
        if (err) {
            console.log("users::fetchOneBzyKey::error - " + JSON.stringify(err, null, 2));
        }
        else {
          i.push(data.Item);
        }
        });
        this.productquery = i;
    }
  }

})
