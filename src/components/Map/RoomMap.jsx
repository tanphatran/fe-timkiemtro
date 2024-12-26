import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const RoomMap = ({ roomLocation }) => {
    const [mapKey] = useState('HPO9LZ1kYbhNOV3tGxjACHV1vkWTMx0myefXd6lb');
    const [mapboxToken] = useState('your_mapbox_token');
    const [mapApiKey] = useState('MMUzzdi4KFO9qIil4TrCZCt4QCYoSiyp3EauN0lO');
    const [coordinates, setCoordinates] = useState(null);
    const [inputLocation, setInputLocation] = useState('');
    const [distance, setDistance] = useState(null);

    useEffect(() => {
        const geocodeAddress = async (address) => {
            try {
                const response = await fetch(
                    `https://rsapi.goong.io/geocode?address=${encodeURIComponent(address)}&api_key=${mapApiKey}`
                );
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    const { lat, lng } = data.results[0].geometry.location;
                    setCoordinates([lng, lat]);
                } else {
                    console.error('Không tìm thấy tọa độ.');
                }
            } catch (error) {
                console.error('Lỗi khi gọi API Geocoding:', error);
            }
        };

        if (roomLocation) {
            geocodeAddress(roomLocation);
        }
    }, [roomLocation, mapApiKey]);

    const handleInputChange = (e) => {
        setInputLocation(e.target.value);
    };

    const calculateDistance = async () => {
        const geocodeInput = async (address) => {
            try {
                const response = await fetch(
                    `https://rsapi.goong.io/Geocode?address=${encodeURIComponent(address)}&api_key=${mapApiKey}`
                );
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    const { lat, lng } = data.results[0].geometry.location;
                    return [lng, lat];
                }
                return null;
            } catch (error) {
                console.error('Lỗi khi gọi API Geocoding:', error);
                return null;
            }
        };

        const inputCoords = await geocodeInput(inputLocation);
        if (!inputCoords) {
            alert('Không tìm thấy địa chỉ nhập vào.');
            return;
        }

        const getDistance = async (origin, destination) => {
            try {
                const response = await fetch(
                    `https://rsapi.goong.io/direction?origin=${origin[1]},${origin[0]}&destination=${destination[1]},${destination[0]}&vehicle=car&api_key=${mapApiKey}`
                );
                const data = await response.json();
                if (data.routes && data.routes.length > 0) {
                    const { distance, duration } = data.routes[0].legs[0];
                    return { distance, duration };
                }
                return null;
            } catch (error) {
                console.error('Lỗi khi gọi API Directions:', error);
                return null;
            }
        };

        const distanceData = await getDistance(coordinates, inputCoords);
        if (distanceData) {
            setDistance(distanceData.distance);
        } else {
            alert('Không thể tính khoảng cách.');
        }
    };

    const drawCircle = (center, radiusInMeters) => {
        const points = 64;
        const coords = [];
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * 2 * Math.PI;
            const dx = radiusInMeters * Math.cos(angle);
            const dy = radiusInMeters * Math.sin(angle);
            coords.push([center[0] + dx / 111320, center[1] + dy / 110540]);
        }
        coords.push(coords[0]); // Close the circle
        return coords;
    };

    useEffect(() => {
        if (coordinates) {
            mapboxgl.accessToken = mapboxToken;
            const map = new mapboxgl.Map({
                container: 'map',
                style: `https://tiles.goong.io/assets/goong_map_web.json?api_key=${mapKey}`,
                zoom: 15,
                center: coordinates,
            });

            map.on('load', () => {
                const circleData = {
                    'type': 'FeatureCollection',
                    'features': [{
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Polygon',
                            'coordinates': [drawCircle(coordinates, 500)]
                        }
                    }]
                };

                map.addSource('circle', {
                    'type': 'geojson',
                    'data': circleData
                });

                map.addLayer({
                    id: 'circle',
                    type: 'fill',
                    source: 'circle',
                    layout: {},
                    paint: {
                        'fill-color': '#588888',
                        'fill-opacity': 0.5
                    }
                });

                new mapboxgl.Marker()
                    .setLngLat(coordinates)
                    .addTo(map);
            });
        }
    }, [coordinates]);

    return (
        <div>
            <div id="map" style={{ width: '100%', height: '400px' }} className='mb-3'></div>
            <div>
                <Input
                    type="text"
                    value={inputLocation}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ để tính khoảng cách"

                />
                <Button onClick={calculateDistance} className="mt-3">Tính khoảng cách</Button>
            </div>
            {distance && (
                <div>
                    <p>Khoảng cách: {distance.text}</p>
                </div>
            )}
        </div>
    );
};

export default RoomMap;
