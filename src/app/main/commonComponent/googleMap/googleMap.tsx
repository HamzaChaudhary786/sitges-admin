"use client"

import React, { useEffect, useState } from 'react'
const loadScript = (url) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
};

const GoogleMap = ({ onLocationChange, IsAddBeachDialogOpen, IsAddRestaurantDialogOpen, IsAddMeuseumDialogOpen, IsAddEventDialogOpen }: any) => {



    const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = "AIzaSyB6bm5mt4pQjgzIIW3ZCHChQbRyajMhsTk"; // Replace with your API key

    useEffect(() => {
        const googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;

        loadScript(googleMapsUrl);

        window.initMap = () => {
            let markers = [];

            // Initialize the map
            const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
            });

            // Create the search box and link it to the UI element.
            const input = document.getElementById('search-input');
            const searchBox = new google.maps.places.SearchBox(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', () => {
                searchBox.setBounds(map.getBounds());
            });

            // Add a click event listener to the map
            map.addListener('click', (event) => {
                const latitude = event.latLng.lat();
                const longitude = event.latLng.lng();
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

                onLocationChange(latitude, longitude);

            });

            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', () => {
                const places = searchBox.getPlaces();

                if (places.length === 0) {
                    return;
                }

                // Clear out the old markers.
                markers.forEach((marker) => marker.setMap(null));
                markers = [];

                // For each place, get the icon, name, and location.
                const bounds = new google.maps.LatLngBounds();
                places.forEach((place) => {
                    if (!place.geometry || !place.geometry.location) {
                        console.log("Returned place contains no geometry");
                        return;
                    }

                    // Create a marker for each place.
                    const marker = new google.maps.Marker({
                        map,
                        title: place.name,
                        position: place.geometry.location,
                    });

                    markers.push(marker);

                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                map.fitBounds(bounds);
            });
        };
    }, [NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, IsAddBeachDialogOpen, IsAddRestaurantDialogOpen, IsAddMeuseumDialogOpen, IsAddEventDialogOpen]);

    return (
        <>
            <div className='mt-44 mb-16' style={{ position: 'relative', height: '400px', width: '100%' }}>
                <input
                    id="search-input"
                    type="text"
                    placeholder="Search for places..."
                    className='absolute top-[10px] left-[10px] z-50 w-[240px] p-[10px]'
                />
                <div id="map" style={{ height: '100%', width: '100%' }}></div>
            </div>

        </>
    )

}

export default GoogleMap