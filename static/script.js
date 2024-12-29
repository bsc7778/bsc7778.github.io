let map;
let service;
let infowindow;

function initMap() {
    const sydney = new google.maps.LatLng(-33.867, 151.207);
    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById('map'), {
        center: sydney,
        zoom: 15
    });

    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault();
        performSearch();
    });
}

function performSearch() {
    const type = document.getElementById('type').value;
    const price = parseInt(document.getElementById('price').value);
    const rating = parseFloat(document.getElementById('rating').value);
    const ambiance = document.getElementById('ambiance').value;
    const openingTimes = document.getElementById('opening-times').value;

    const request = {
        location: map.getCenter(),
        radius: '1500',
        type: ['restaurant']
    };

    if (type) request.keyword = type;
    if (!isNaN(price)) request.minPriceLevel = price;
    if (!isNaN(rating)) request.minRating = rating;

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, handleResults);
}

function handleResults(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        const resultDiv = document.getElementById('results');
        resultDiv.innerHTML = '';
        for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
            resultDiv.innerHTML += `<p>${results[i].name} - ${results[i].rating} stars - ${results[i].vicinity}</p>`;
        }
    }
}

function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(`${place.name}<br>${place.rating} stars<br>${place.vicinity}`);
        infowindow.open(map, this);
    });
}
