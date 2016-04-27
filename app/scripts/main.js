class TflApp {
  constructor() {
    console.log('App Initialized!');
  }

  onMapInit() {
    this.map = new google.maps.Map(document.getElementById('tfl-map'), {
      center: {
        lat: 51.51,
        lng: -0.1
      },
      scrollwheel: false,
      zoom: 13
    });
  }

}

/* eslint-env browser */
(function() {
  'use strict';

  // initialize app
  var app = new TflApp();

  // export map initialization function
  window.initMap = app.onMapInit;

  // Your custom JavaScript goes here
})();
