import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import WorkLocation from "../../../models/WorkLocation.ts";

interface MapComponentProps {
    locations: WorkLocation[];
}

const MapComponent: React.FC<MapComponentProps> = ({ locations }) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);

    useEffect(() => {
        // Construct the URL using VITE_API_URL
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/config/google-maps-api-key`;

        // Fetch the API key from the backend
        fetch(apiUrl)
            .then(response => response.text())
            .then(key => {
                setApiKey(key);
            })
            .catch(err => {
                console.error('Error fetching Google Maps API key:', err);
            });
    }, []);

    useEffect(() => {
        if (apiKey) {
            const loader = new Loader({
                apiKey: apiKey,
                version: 'weekly',
            });

            loader.load().then((google) => {
                if (mapRef.current) {
                    const map = new google.maps.Map(mapRef.current as HTMLElement, {
                        center: { lat: locations[0].latitude, lng: locations[0].longitude },
                        zoom: 20,
                        styles: [
                            {
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#f5f5f5"
                                    }
                                ]
                            },
                            {
                                "featureType": "administrative.country",
                                "elementType": "geometry.stroke",
                                "stylers": [
                                    { "color": "#8c8f9f" },
                                    { "weight": 2 }
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
                                "elementType": "labels.text.fill",
                                "stylers": [
                                    {
                                        "color": "#616161"
                                    }
                                ]
                            },
                            {
                                "elementType": "labels.text.stroke",
                                "stylers": [
                                    {
                                        "color": "#f5f5f5"
                                    }
                                ]
                            },
                            {
                                "featureType": "administrative.land_parcel",
                                "elementType": "labels.text.fill",
                                "stylers": [
                                    {
                                        "color": "#bdbdbd"
                                    }
                                ]
                            },
                            {
                                "featureType": "poi",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#eeeeee"
                                    }
                                ]
                            },
                            {
                                "featureType": "poi.park",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#e5e5e5"
                                    }
                                ]
                            },
                            {
                                "featureType": "road",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#ffffff"
                                    }
                                ]
                            },
                            {
                                "featureType": "road.arterial",
                                "elementType": "labels.text.fill",
                                "stylers": [
                                    {
                                        "color": "#757575"
                                    }
                                ]
                            },
                            {
                                "featureType": "road.highway",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#dadada"
                                    }
                                ]
                            },
                            {
                                "featureType": "road.highway",
                                "elementType": "labels.text.fill",
                                "stylers": [
                                    {
                                        "color": "#616161"
                                    }
                                ]
                            },
                            {
                                "featureType": "water",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#c9c9c9"
                                    }
                                ]
                            },
                            {
                                "featureType": "water",
                                "elementType": "labels.text.fill",
                                "stylers": [
                                    {
                                        "color": "#9e9e9e"
                                    }
                                ]
                            }
                        ],
                    });

                    const bounds = new google.maps.LatLngBounds();

                    locations.forEach(location => {
                        new google.maps.Marker({
                            position: { lat: location.latitude, lng: location.longitude },
                            map: map,
                            title: `${location.city}, ${location.country}`
                        });
                        bounds.extend({ lat: location.latitude, lng: location.longitude });
                    });

                    if (locations.length > 1) {
                        map.fitBounds(bounds);
                    } else {
                        map.setZoom(12);
                    }
                }
            }).catch(err => {
                console.error('Error loading Google Maps API:', err);
            });
        }
    }, [apiKey, locations]);

    return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default MapComponent;
