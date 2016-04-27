// Disruptionc lass for storing parsed data
class Disruption {
  constructor(params) {
    this.id = params.id;
    this.status = params.status;
    this.category = params.category;
    this.comments = params.comments;

    let coords = params.coordinates.split(',');

    this.coordinates = {
      lng: parseFloat(coords[0], 10),
      lat: parseFloat(coords[1], 10)
    };
  }

  isActive() {
    return this.status === 'Active';
  }

}

// create Disruptions from XML nodes
class DisruptionFactory {

  createDisruptionFromXMLNode(node) {
    let status = this.getNodeValue(node, 'status');
    let category = this.getNodeValue(node, 'category');
    let comments = this.getNodeValue(node, 'comments');

    let coordinates = this.getCoordinates(node);

    return new Disruption({
      id: node.id,
      status: status,
      category: category,
      comments: comments,
      coordinates: coordinates
    });
  }

  // simple search in node to find text content of desired child
  getNodeValue(node, name) {
    return node.getElementsByTagName(name)[0].textContent;
  }

  // find coordinates of disruption
  getCoordinates(node) {
    let displayPoint = node.getElementsByTagName('DisplayPoint')[0];
    return displayPoint.getElementsByTagName('coordinatesLL')[0].textContent;
  }

}

// Main App class
class TflApp {

  constructor() {
    this.apiUrl = 'https://data.tfl.gov.uk/tfl/syndication/feeds/tims_feed.xml?app_id=&app_key=';
    this.disruptions = [];
    this.map = null;
  }

  // Runs when Google maps script is loaded, initialize empty map
  onMapInit() {
    /* global google */
    this.map = new google.maps.Map(document.getElementById('tfl-map'), {
      center: {lat: 51.51, lng: -0.1},
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
    request.open('GET', this.apiUrl);
    request.send();
  }

  // handle API response
  onResponse(event) {
    this.extractResults(event.target.responseXML);
    this.renderToMap();
  }

  // handle API error
  onError(error) {
    console.log('Fetch error:', error);
  }

  // grab the results XML and store it in array
  extractResults(xml) {
    let disruptions = xml.getElementsByTagName('Disruption');

    const disruptionFactory = new DisruptionFactory();

    for (let i = 0; i < disruptions.length; i++) {
      let d = disruptions[i];
      this.disruptions.push(disruptionFactory.createDisruptionFromXMLNode(d));
    }
  }

  // renders disruptions to map
  renderToMap() {
    this.disruptions.forEach(function(d) {
      // creating only markers for active disruptions
      if (d.isActive()) {
        this.addMapMarker(d);
      }
    }, this);
  }

  // creates single marker
  addMapMarker(disruption) {
    let marker = new google.maps.Marker({
      position: disruption.coordinates,
      map: this.map,
      title: disruption.status,
      disruption: disruption
    });

    marker.addListener('click', function() {
      this.openInfoWindow(marker);
    }.bind(this));
  }

  // displays info window
  openInfoWindow(marker) {
    if (!this.infoWindow) {
      this.infoWindow = new google.maps.InfoWindow({content: ''});
    }

    let disruption = marker.disruption;
    this.infoWindow.setContent(disruption.comments);
    this.infoWindow.open(this.map, marker);
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
