import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import JobOfferListedDTO from "../../models/dtos/JobOfferListedDTO.ts";

interface HomeMapProps {
    jobOffers: JobOfferListedDTO[];
    onMarkerClick: (city: string, country: string) => void;
}

const HomeMap: React.FC<HomeMapProps> = ({ jobOffers, onMarkerClick }) => {
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

            loader.load().then(() => {
                if (mapRef.current) {
                    const map = new google.maps.Map(mapRef.current as HTMLElement, {
                        center: { lat: 48.8566, lng: 2.3522 },
                        zoom: 12,
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

                    const locationMap = new Map<string, { offers: JobOfferListedDTO[], city: string, country: string }>();

                    const bounds = new google.maps.LatLngBounds();

                    jobOffers.forEach(offer => {
                        offer.workLocations.forEach(location => {
                            const locationKey = `${location.latitude},${location.longitude}`;
                            if (!locationMap.has(locationKey)) {
                                locationMap.set(locationKey, { offers: [], city: location.city, country: location.country });
                            }
                            locationMap.get(locationKey)?.offers.push(offer);
                        });
                    });

                    locationMap.forEach((locationData, locationKey) => {
                        const [lat, lng] = locationKey.split(',').map(Number);
                        const offerCount = locationData.offers.length;

                        const marker = new google.maps.Marker({
                            position: { lat, lng },
                            map,
                            label: `${offerCount}`,
                            title: offerCount === 1 ? "1 job offer" : `${offerCount} job offers`,
                        });

                        bounds.extend({ lat, lng });

                        marker.addListener('click', () => {
                            onMarkerClick(locationData.city, locationData.country);
                        });
                    });
                    if (!bounds.isEmpty()) {
                        if (locationMap.size === 1) {
                            map.setZoom(12);
                            map.setCenter(bounds.getCenter());
                        } else {
                            map.fitBounds(bounds);
                        }
                    }
                }
            }).catch(err => {
                console.error('Error loading Google Maps API:', err);
            });
        }
    }, [apiKey, jobOffers, onMarkerClick]);

    return <div ref={mapRef} style={{ width: '100%', height: '600px' }} />;
};

export default HomeMap;
