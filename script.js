// https://classroom.udacity.com/courses/ud864

var map;
function initMap() {
    // Constructor creates a new map: only center and zoom are required
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.741359, lng: -73.9980244},
        // zoom range up to 21
        zoom: 13
    });
    var tribeca = {lat: 40.719526, lng: -74.0089934};
    var marker = new google.maps.Marker({
        position: tribeca,
        map: map,
        title: 'First Marker!'
    });
    
    
}