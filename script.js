// https://classroom.udacity.com/courses/ud864
/*global google*/
var map;

// Create a new blank array for all the listing markers
var markers = [];

function initMap() {
    // Constructor creates a new map: only center and zoom are required
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.741359, lng: -73.9980244},
        // zoom range up to 21
        zoom: 13
    });
    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.
    var locations = [
        {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
        {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
        {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
        {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
        {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
        {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}        
    ];
    
    var largeInfoWindow = new google.maps.InfoWindow();
    
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position and title from the location array
        var position = locations[i].location;
        var title = locations[i].title;
        // Create one marker per location, and put into markers array
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfoWindow);
        });
    }
    
    // This function populates the infowindow when the marker is clicked. We'll
    // only allow one infowindow which will open at the marker that is clicked,
    // and populate based on that marker's position
    function populateInfoWindow(marker, infoWindow) {
        // Check to make sure the infowindow is not already opened on this marker
        if (infoWindow.marker != marker) {
            infoWindow.marker = marker;
            infoWindow.setContent('<div>' + marker.title + '</div>');
            infoWindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed
            infoWindow.addListener('closeclick', function() {
                infoWindow.marker = null;
            });
        }
    }
    
}