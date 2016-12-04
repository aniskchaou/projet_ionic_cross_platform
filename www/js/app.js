// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });


})

.controller('MapController', function($scope, $ionicLoading,$http) {
 
    google.maps.event.addDomListener(window, 'load', function() {
        var myLatlng = new google.maps.LatLng(34.7620192, 34.7620192);
        /*var m1 = { lat: 36.8097377, lng: 10.184986 };
        var m2 = { lat: 36.811894, lng: 10.183034 };
        var m3 = { lat: 36.812277, lng: 10.183034 };
        var m4 = { lat: 36.812751, lng: 10.183034 };
        var m5 = { lat: 36.81419, lng: 10.183034 };
        var m6 = { lat: 36.812043, lng: 10.186145 };
        var m7 = { lat: 36.800705, lng: 10.190394 };
        var m8 = { lat: 36.807861, lng: 10.167134 };
        */
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var labelIndex = 0;

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
         var restaurants;

              navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
             
           /* var marker1 = new google.maps.Marker({
          position: m1,
          label: labels[labelIndex++ % labels.length],
          map: map
           });
          */
           $scope.map = map;
          });
           
          


          $http.get("http://localhost/projetionic/index.php")
          .then(function (response) {
          restaurants = response.data.restaurants;
            
           for (var i = 0; i < restaurants.length; i++) {
              
              
              var m =new google.maps.LatLng(restaurants[i].lat, restaurants[i].lng) ;
             
              addMarker(m,map,restaurants[i].name);
              
            } 
        });
       
         
        
 
         


         function addMarker(location, map,title) {
        // Add the marker at the clicked location, and add the next-available label
        // from the array of alphabetical characters.
        var infowindow = new google.maps.InfoWindow({
          content: title
        });

        var marker = new google.maps.Marker({
          position: location,
          title: labels[labelIndex++ % labels.length],
          map: map
        });

         

         marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
        }
    });
 
 
})


.controller('getrestaurants', function($scope, $ionicLoading, $http,$ionicPopup) {
/*$http.get("http://allsciences.byethost32.com/ionic/index.php")
   .then(function (response) {
    
   $scope.restaurants = response.data.restaurants;

  });*/
//$scope.restaurants = [{"name":"df","lat":"sdf","lng":"df"},{"name":"ddqff","lat":"sddsf","lng":"dfsdf"}];
var bounds = new google.maps.LatLngBounds;
        
        var markersArray = [];
        var destinationsList = [];


        var origin1 = new google.maps.LatLng(36.800705, 10.186145) ;
        //var origin2 = 'Greenwich, England';
        //var destinationA = 'Stockholm, Sweden';
        var destinationB = {lat: 36.811894, lng: 10.183034};
        var destinationA =new google.maps.LatLng(36.812751, 10.183034) ;
        var destinationC =new google.maps.LatLng(36.81419, 10.183034) ;
        var destinationD =new google.maps.LatLng(36.800705, 10.190394) ;

        destinationsList.push(destinationB);
        destinationsList.push(destinationA);
        destinationsList.push(destinationC);
        destinationsList.push(destinationD);

        var destinationIcon = 'https://chart.googleapis.com/chart?' +
            'chst=d_map_pin_letter&chld=D|FF0000|000000';
        var originIcon = 'https://chart.googleapis.com/chart?' +
            'chst=d_map_pin_letter&chld=O|FFFF00|000000';
       
        var map = new google.maps.Map(document.getElementById('map2'), {
          center: {lat: 55.53, lng: 9.4},
          zoom: 10
        });
        var geocoder = new google.maps.Geocoder;

        var service = new google.maps.DistanceMatrixService;
        getdistance(service,destinationsList);
        
        var liste;




        function getdistance (service,destinationsList) {
                  service.getDistanceMatrix({
          origins: [origin1],
          destinations: destinationsList,
          travelMode: 'DRIVING',
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, function(response, status) {
          if (status !== 'OK') {
            alert('Error was: ' + status);
          } else {
            var originList = response.originAddresses;
            var destinationList = response.destinationAddresses;
            var outputDiv = document.getElementById('output');
            outputDiv.innerHTML = '';
            deleteMarkers(markersArray);

            var showGeocodedAddressOnMap = function(asDestination) {
              var icon = asDestination ? destinationIcon : originIcon;
              return function(results, status) {
                if (status === 'OK') {
                  map.fitBounds(bounds.extend(results[0].geometry.location));
                  markersArray.push(new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    icon: icon
                  }));
                } else {
                  alert('Geocode was not successful due to: ' + status);
                }
              };
            };

            for (var i = 0; i < originList.length; i++) {
              var results = response.rows[i].elements;
              geocoder.geocode({'address': originList[i]},
                  showGeocodedAddressOnMap(false));
              for (var j = 0; j < results.length; j++) {
                geocoder.geocode({'address': destinationList[j]},
                    showGeocodedAddressOnMap(true));
                outputDiv.innerHTML += originList[i] + ' to ' + destinationList[j] +
                    ': ' + results[j].distance.text + ' in ' +
                    results[j].duration.text + '<br>';
                   


                    liste+=originList[i] + ' to ' + destinationList[j] +
                    ': ' + results[j].distance.text + ' in ' +
                    results[j].duration.text + '<br><br><br>';
              }
            }
          }
        });
        }
      

      function deleteMarkers(markersArray) {
        for (var i = 0; i < markersArray.length; i++) {
          markersArray[i].setMap(null);
        }
        markersArray = [];
      }  






      $scope.showPopup = function() {
      $scope.data ={} ;
    
      // Custom popup
      var myPopup = $ionicPopup.show({
         template: '<div ng-model = "data.model">'+liste+'</div>',
         title: 'INFO',
         subTitle: 'Subtitle',
         scope: $scope,
      
         buttons: [
            { text: 'Cancel' }, {
               text: '<b>Save</b>',
               type: 'button-positive',
                  onTap: function(e) {
            
                     if (!$scope.data.model) {
                        //don't allow the user to close unless he enters model...
                           e.preventDefault();
                     } else {
                        return $scope.data.model;
                     }
                  }
            }
         ]
      });

      myPopup.then(function(res) {
         console.log('Tapped!', res);
      });    
   };

















  })


.controller('getdirections', function($scope, $ionicLoading, $http) {
$http.get("http://localhost/projetionic/index.php")
   .then(function (response) {$scope.restaurants = response.data.restaurants;});



   var markerArray = [];

        // Instantiate a directions service.
        var directionsService = new google.maps.DirectionsService;

        // Create a map and center it on Manhattan.
        var map = new google.maps.Map(document.getElementById('mapp'), {
          zoom: 13,
          center: {lat: 36.806443, lng: 10.181456}
        });

        // Create a renderer for directions and bind it to the map.
        var directionsDisplay = new google.maps.DirectionsRenderer({map: map});

        // Instantiate an info window to hold step text.
        var stepDisplay = new google.maps.InfoWindow;

        // Display the route between the initial start and end selections.
        calculateAndDisplayRoute(
            directionsDisplay, directionsService, markerArray, stepDisplay, map);
        // Listen to change events from the start and end lists.
        var onChangeHandler = function() {
          calculateAndDisplayRoute(
              directionsDisplay, directionsService, markerArray, stepDisplay, map);
        };
        document.getElementById('start').addEventListener('change', onChangeHandler);
        document.getElementById('end').addEventListener('change', onChangeHandler);
      

      function calculateAndDisplayRoute(directionsDisplay, directionsService,
          markerArray, stepDisplay, map) {
        // First, remove any existing markers from the map.
        for (var i = 0; i < markerArray.length; i++) {
          markerArray[i].setMap(null);
        }

        // Retrieve the start and end locations and create a DirectionsRequest using
        // WALKING directions.
        directionsService.route({
          origin: document.getElementById('start').value,
          destination: document.getElementById('end').value,
          travelMode: 'WALKING'
        }, function(response, status) {
          // Route the directions and pass the response to a function to create
          // markers for each step.
          if (status === 'OK') {
            document.getElementById('warnings-panel').innerHTML =
                '<b>' + response.routes[0].warnings + '</b>';
            directionsDisplay.setDirections(response);
            showSteps(response, markerArray, stepDisplay, map);
          } else {
            //window.alert('Directions request failed due to ' + status);
          }
        });
      }

      function showSteps(directionResult, markerArray, stepDisplay, map) {
        // For each step, place a marker, and add the text to the marker's infowindow.
        // Also attach the marker to an array so we can keep track of it and remove it
        // when calculating new routes.
        var myRoute = directionResult.routes[0].legs[0];
        for (var i = 0; i < myRoute.steps.length; i++) {
          var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
          marker.setMap(map);
          marker.setPosition(myRoute.steps[i].start_location);
          attachInstructionText(
              stepDisplay, marker, myRoute.steps[i].instructions, map);
        }
      }

      function attachInstructionText(stepDisplay, marker, text, map) {
        google.maps.event.addListener(marker, 'click', function() {
          // Open an info window when the marker is clicked on, containing the text
          // of the step.
          stepDisplay.setContent(text);
          stepDisplay.open(map, marker);
        });
      }



















  });
