Template.registerHelper("currentLocationsIteration", function() {
  result = [];
  //finds all locations by current user id
  currentLocations.find().forEach(function(marker) {
    result.push({
      name: marker.name,
      url: marker.url,
      street: marker.street,
      city: marker.city,
      state: marker.state,
      zipCode: marker.zipCode,
      foods: marker.foods,
      hours: marker.hours,
      orgID: marker.orgID,
      closures: marker.closures,
      eligibility: marker.eligibility,
      eligibilityURL: marker.eligibilityURL,
      documents: marker.documents,
      dataid: marker.dataid,
      phone: marker.phone
    });
  });
  return result;
});


Template.locations.events({
  "click .table-row": function() {
    var id = this.dataid;
    var marker = Markers.findOne(id);
    new google.maps.Geocoder().geocode({'address': marker.street + ', ' + marker.city + ', ' + marker.state + ' ' + marker.zipCode}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if(currentInfoWindow !== 'undefined') {
          currentInfoWindow.close();
        }
        currentInfoWindow = getInfoWindow(marker);
        currentInfoWindow.open(GoogleMaps.get("map").instance, markers[id]);

        GoogleMaps.get("map").instance.setZoom(12);
        GoogleMaps.get("map").instance.panTo(results[0].geometry.location);

        window.scrollTo(0, 0);
      } else {
        alert('Whoops! An error occurred! The error status is as follows: ' + status);
      }
    });
  }
});
Template.locations.helpers({
  'isURL': function(){
    if(this.url === "TBD" || this.url === ''){
      return false;
    }
    else{
      return true;
    }
  },
  'isInRadius': function(){
    var marker = Markers.findOne(this.dataid);
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [new google.maps.LatLng(marker.latitude, marker.longitude)],
        destinations: [document.getElementById('searchBar').value],
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        travelMode:google.maps.TravelMode.DRIVING
      }, callback);

      function callback(response, status) {
        console.log(response);
      }
      return true;
    }
  });
