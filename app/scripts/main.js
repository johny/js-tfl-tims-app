class Disruption {
  constructor(xmlNode) {
    this.id = xmlNode.id;
  }
}

class TflApp {

  constructor() {
    this.apiUrl = 'https://data.tfl.gov.uk/tfl/syndication/feeds/tims_feed.xml?app_id=&app_key=';
    this.disruptions = [];
    this.map = null;
  }

  // Runs when Google maps script is loaded, initialize empty map
  onMapInit() {
    this.map = new google.maps.Map(document.getElementById('tfl-map'), {
      center: {
        lat: 51.51,
        lng: -0.1
      },
      scrollwheel: false,
      zoom: 13
    });

    this.fetchData();
  }

  // fetches data from API via fetch api
  // https://developers.google.com/web/updates/2015/03/introduction-to-fetch
  fetchData() {
    let request = new XMLHttpRequest();
    request.addEventListener('load', this.onResponse.bind(this));
    request.open("GET", this.apiUrl);
    request.send()
  }

  // handle API response
  onResponse(event) {
    this.extractResults(event.target.responseXML);
    this.renderToMap();
  }

  // handle API error
  onError(err) {
    console.log('Fetch error:', error);
  }

  // grab the results XML and store it in array
  extractResults(xml) {
    let disruptions = xml.getElementsByTagName('Disruption');

    for (let i = 0; i < disruptions.length; i++) {
      let d = disruptions[i];
    }

  }

  renderToMap() {
    console.log('Should render to map...')
  }

}

/* eslint-env browser */
(function() {
  'use strict';

  // initialize app
  const app = new TflApp();

  // export map initialization function
  window.initMap = app.onMapInit.bind(app);

  // Your custom JavaScript goes here
})();
