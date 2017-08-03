// https://classroom.udacity.com/courses/ud864

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.741359, lng: -73.9980244},
        zoom: 13
    });
}