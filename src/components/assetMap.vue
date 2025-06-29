<script setup>
import { usePortfolioStore } from '@/stores/stores';
import { mapStores } from 'pinia';


</script>
<script>

export default {
    data() {
        return {
         center: {
             lat: 39.39292453636032 ,
             lng: -76.6770116747292 , 
         }
        }
    },
    mounted() {
        this.initiateMap();
    },
    computed: {
        ...mapStores(usePortfolioStore),
    },
    methods: {
        initiateMap() {
        let map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        minZoom: 6,
        draggable: true,
        center: this.center,
        scrollwheel: true,
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: 
      
      [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#523735"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#447530"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#e9bc62"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#db8555"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#b9d3c2"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#92998d"
            }
          ]
        }
      ]

    });

        const marker =  new window.google.maps.Marker({
            position: new window.google.maps.LatLng(this.center.lat, this.center.lng),
            draggable: true,
            map: map
            
        })


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
            device.on('connect', function () {
            // console.log("Connected!");
            device.subscribe('assetTrackingMap');
            // console.log('Subscribed and receiving from: PortfolioMap');
        });
        device.on('message', function (topic, msg){    
            let info = msg.toString();
            let coords = JSON.parse(info);
            if (coords){
              marker.setPosition(new window.google.maps.LatLng(coords.latitude, coords.longitude))
              map.panTo(new window.google.maps.LatLng(coords.latitude, coords.longitude))
            }
        });
  
        },

}
}


</script>

<template>
        <v-row>
            <div id='map' style="height:300px; width: 100%; border: 2px solid #333; border-radius: 4px;"></div>
        </v-row>
</template>
