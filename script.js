// https://classroom.udacity.com/courses/ud864
/*global google*/
var map;

// Create a new blank array for all the listing markers
var markers = [];

function initMap() {
		// Create a styles array to use with the map
		var styles = [
		{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [
						{
								"color": "#193341"
						}
				]
		},
		{
				"featureType": "landscape",
				"elementType": "geometry",
				"stylers": [
						{
								"color": "#2c5a71"
						}
				]
		},
		{
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [
						{
								"color": "#29768a"
						},
						{
								"lightness": -37
						}
				]
		},
		{
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [
						{
								"color": "#406d80"
						}
				]
		},
		{
				"featureType": "transit",
				"elementType": "geometry",
				"stylers": [
						{
								"color": "#406d80"
						}
				]
		},
		{
				"elementType": "labels.text.stroke",
				"stylers": [
						{
								"visibility": "on"
						},
						{
								"color": "#3e606f"
						},
						{
								"weight": 2
						},
						{
								"gamma": 0.84
						}
				]
		},
		{
				"elementType": "labels.text.fill",
				"stylers": [
						{
								"color": "#ffffff"
						}
				]
		},
		{
				"featureType": "administrative.neighborhood",
				"elementType": "labels",
				"stylers": [
						{
								"color": "#f4dc42"
						},
						{
								"weight": .5
						}
				]
		},    
		{
				"featureType": "administrative",
				"elementType": "geometry",
				"stylers": [
						{
								"weight": 0.6
						},
						{
								"color": "#1a3541"
						}
				]
		},
		{
				"elementType": "labels.icon",
				"stylers": [
						{
								"visibility": "off"
						}
				]
		},
		{
				"featureType": "poi.park",
				"elementType": "geometry",
				"stylers": [
						{
								"color": "#297c16"
						}
				]
		}
];
		
		// Constructor creates a new map: only center and zoom are required
		map = new google.maps.Map(document.getElementById('map'), {
				center: {lat: 40.741359, lng: -73.9980244},
				// zoom range up to 21
				zoom: 13,
				styles: styles,
				mapTypeControl: false
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
		
		// Initialize the drawing manager
		var drawingManager = new google.maps.drawing.DrawingManager({
			drawingMode: google.maps.drawing.OverlayType.POLYGON,
			drawingControl: true,
				drawingControlOptions: {
					position: google.maps.ControlPosition.TOP_LEFT,
					drawingmodes: [
						google.maps.drawing.OverlayType.POLYGON
					]
				}
		});
		
		// Style the markers. This will be our listimg marker icon.
		var defaultIcon = makeMarkerIcon('0091ff');
		
		// Create a "highlighted location" marker color for when the user mouses over the marker
		var highlightedIcon = makeMarkerIcon('FFFF24');
		
		// The following group uses the location array to create an array of markers on initialize.
		for (var i = 0; i < locations.length; i++) {
				// Get the position and title from the location array
				var position = locations[i].location;
				var title = locations[i].title;
				// Create one marker per location, and put into markers array
				var marker = new google.maps.Marker({
						position: position,
						title: title,
						icon: defaultIcon,
						animation: google.maps.Animation.DROP,
						id: i
				});
				// Push the marker to our array of markers
				markers.push(marker);
				// Create an onclick event to open an infowindow at each marker
				marker.addListener('click', function() {
						populateInfoWindow(this, largeInfoWindow);
				});
				// Two event listeners: one for mouseover, other for mouseout,
				// to change the colors back and forth
				marker.addListener('mouseover', function() {
						this.setIcon(highlightedIcon);
				});
				marker.addListener('mouseout', function() {
					 this.setIcon(defaultIcon); 
				});
		}
		
		document.getElementById('show-listings').addEventListener('click', showListings);
		document.getElementById('hide-listings').addEventListener('click', hideListings);
		
		document.getElementById('toggle-drawing').addEventListener('click', function() {
			toggleDrawing(drawingManager);
		})
		
		// This function populates the infowindow when the marker is clicked. We'll
		// only allow one infowindow which will open at the marker that is clicked,
		// and populate based on that marker's position
		function populateInfoWindow(marker, infoWindow) {
				// Check to make sure the infowindow is not already opened on this marker
				if (infoWindow.marker != marker) {
						// Clear the infoWindow content to give the streetview time to load
						infoWindow.setContent('');
						infoWindow.marker = marker;

						// Make sure the marker property is cleared if the infowindow is closed
						infoWindow.addListener('closeclick', function() {
								infoWindow.marker = null;
						});
						var streetViewService = new google.maps.StreetViewService();
						var radius = 50;
						// In case the status is OK, which means the panoramic image was found,
						// compute the position of the streetview image, then calculate the heading,
						// then get a panorama from that and set the options
						function getStreetView(data, status) {
							if (status == google.maps.StreetViewStatus.OK) {
								var nearStreetViewLocation = data.location.latLng;
								var heading = google.maps.geometry.spherical.computeHeading(
									nearStreetViewLocation, marker.position);
									infoWindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
									var panoramaOptions = {
											position: nearStreetViewLocation,
											pov: {
													heading: heading,
													pitch: 30
											}
									};
								var panorama = new google.maps.StreetViewPanorama(
										document.getElementById('pano'), panoramaOptions);
							} else {
									infoWindow.setContent('<div>' + marker.title + '</div>' + 
									'<div>No Street View Found</div>');
							}
						}
						// Use streetview service to get the closest streetview image within
						// 50 meters of the marker's position
						streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
						// Open the infowindow on the correct marker 
						infoWindow.open(map, marker);
						
				}
		}
		
		function showListings() {
				var bounds = new google.maps.LatLngBounds();
				// Extend the boundaries of the map for each marker and display the marker
				for (var i = 0; i < markers.length; i++) {
						markers[i].setMap(map);
						bounds.extend(markers[i].position);
				}
				map.fitBounds(bounds);
		}
		
		// This function will loop through the listings and hide them all
		function hideListings() {
				for (var i = 0; i < markers.length; i++) {
						markers[i].setMap(null);
				}
		}
		
		// This function takes in a COLOR, and then creates a new marker
		// icon of that color. The icon will be 21 px wide by 34 high, have an origin
		// of 0, 0 and be anchored at 10, 34).
		function makeMarkerIcon(markerColor) {
				var markerImage = new google.maps.MarkerImage(
						'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + 
						'|40|_|%E2%80%A2',
						new google.maps.Size(21, 34),
						new google.maps.Point(0, 0),
						new google.maps.Point(10, 34),
						new google.maps.Size(21, 34));
				return markerImage;
		}
		
		// This shows and hides (respectively) the drawing options
		function toggleDrawing(drawingManager) {
			if (drawingManager.map) {
				drawingManager.setMap(null);
			} else {
				drawingManager.setMap(map);
			}
		}
}