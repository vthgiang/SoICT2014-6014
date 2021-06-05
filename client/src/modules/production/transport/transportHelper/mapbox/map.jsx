import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios'
import './mapstyles.css';
function MapContainer(props) {

    const {locations, driverLocation, nonDirectLocations, zoom} = props;

    const mapContainer = useRef(null);
    // const map = useRef(null);
    const [map1,setMap] = useState(null);
    
    const [center, setCenter] = useState({lng: 100, lat: 20})

    const [direction, setDirection] = useState();

    const [listMarker, setListMarker] = useState([]);
    const [routeLayer, setRouteLayer] = useState();
    mapboxgl.accessToken = "pk.eyJ1Ijoia2llbm5kdHZuaXN0IiwiYSI6ImNrcGprZGFvcjExcGUybmprYjZkYzFyOWsifQ.vWflR8QYCqpVNlLhO_TR6g"
    // useEffect(() => {
        
    //     const map = new mapboxgl.Map({
    //         container: mapContainer.current,
    //         style: 'mapbox://styles/mapbox/streets-v8',
    //         center: [100, 20],
    //         zoom: 8,
    //     });

    //     let nav = new mapboxgl.NavigationControl();
    //     map.addControl(nav, 'bottom-right');

    //     // var req = new XMLHttpRequest();
    //     // req.responseType = 'json';
    //     // req.open('GET', url, true);
    //     // req.onload  = function() {
    //     //     var jsonResponse = req.response;
    //     //     var distance = jsonResponse.routes[0].distance*0.001;
    //     //     var duration = jsonResponse.routes[0].duration/60;
    //     //     var steps = jsonResponse.routes[0].legs[0].steps;
    //     //     var coords = jsonResponse.routes[0].geometry;
    //     //   //  console.log(steps);
    //     // console.log(coords, " haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    //     // }
        
    //     setMap(map);
    // }, []);

    useEffect(() => {
        let timeCount = setTimeout(() => {

        // Xóa bỏ hết các lít marker cũ
        // let map = map1;
        // if (!map){
            let map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v8',
                center: [100, 20],
                zoom: 8,
            });
    
            let nav = new mapboxgl.NavigationControl();
            map.addControl(nav, 'bottom-right');
            setMap(map);
        // }
        if (listMarker && listMarker.length!==0){
            listMarker.map(marker => {
                marker.remove();
            })
        }
        let newListMarker = [];
        if (nonDirectLocations && nonDirectLocations.length !==0){
            nonDirectLocations.map((item, index) => {
                let marker = new mapboxgl.Marker({
                    color: "blue"
                })
                .setLngLat(item.location).setPopup(new mapboxgl.Popup({
                    offset: 25,
                    closeOnClick: false,
                    closeButton: false,
                    focusAfterOpen: false,
                    closeOnMove: false,
                    anchor: "center"
                  }) // add popups
                  .setHTML(`<p class="transport-text-popup-map">${item.name?item.name:""}</p>`)
                  .setMaxWidth(30))
                .addTo(map)
                .togglePopup();
                newListMarker.push(marker);
            })
        }
        let listGeocodeDirection="";

        if (driverLocation && driverLocation.length!==0){
            locations.map((item,index) => {
                let marker = new mapboxgl.Marker({
                    color: "red"
                })
                .setLngLat(item.location).setPopup(new mapboxgl.Popup({
                    offset: 25,
                    closeOnClick: false,
                    closeButton: false,
                    focusAfterOpen: false,
                    closeOnMove: false,
                    anchor: "center"
                  }) // add popups
                  .setHTML(`<p class="transport-text-popup-map">C</p>`)
                  .setMaxWidth(30))
                .addTo(map)
                .togglePopup();
                newListMarker.push(marker);
                listGeocodeDirection+=item.location.lng + "," + item.location.lat + ";";
            })
        }

        if (locations && locations.length!==0){
            locations.map((item,index) => {
                let marker = new mapboxgl.Marker({
                    color: "green"
                })
                .setLngLat(item.location).setPopup(new mapboxgl.Popup({
                    offset: 25,
                    closeOnClick: false,
                    closeButton: false,
                    focusAfterOpen: false,
                    closeOnMove: false,
                    anchor: "center"
                  }) // add popups
                  .setHTML(`<p class="transport-text-popup-map">${item.name?item.name:""}</p>`)
                  .setMaxWidth(30))
                .addTo(map)
                .togglePopup();
                newListMarker.push(marker);
                listGeocodeDirection+=item.location.lng + "," + item.location.lat + ";";
            })
        }
        if (listGeocodeDirection !== ""){
            listGeocodeDirection = listGeocodeDirection.substring(0, listGeocodeDirection.length-1);

            let url = 'https://api.mapbox.com/directions/v5/mapbox/driving/'+ listGeocodeDirection
            +'?access_token=' + mapboxgl.accessToken + "&geometries=geojson";
            try{
                console.log(url);
                axios.get(url)
                .then(res => {
                    const data = res.data;
                    if (data.routes && data.routes.length !==0){
                        console.log(data.routes);
                        setDirection(data.routes[0].geometry);
                    }
                    else {
                        setDirection(null);
                    }
                })
                
            }
            catch(e){
                console.log(e);
            }    
        }
        
    }, 2000)
    }, [props])

    useEffect(() => {
        if (direction){
            if (map1.getSource('route')) {
                map1.removeLayer('route');
                map1.removeSource('route')
            } else{
                map1.on('load', () => {
                    map1.addLayer({
                        "id": "route",
                        "type": "line",
                        "source": {
                            "type": "geojson",
                            "data": {
                                "type": "Feature",
                                "properties": {},
                                "geometry": direction
                            }
                        },
                        "layout": {
                            "line-join": "round",
                            "line-cap": "round"
                        },
                        "paint": {
                            "line-color": "#1db7dd",
                            "line-width": 8,
                            "line-opacity": 0.8
                        }
                    });
                    setRouteLayer() // =====================
                })
                
            };
            
        }
    }, [direction])
    return (
            <div ref={mapContainer} className="map-container" style={{height: "400px", width: "100%"}} />
        );
}

// function App() {
//     const mapContainer = useRef(null);
//     const map = useRef(null);
//     const [lng, setLng] = useState(105.4758682);
//     const [lat, setLat] = useState(21.1256643);
//     const [zoom, setZoom] = useState(10);
//     mapboxgl.accessToken = "pk.eyJ1Ijoia2llbm5kdHZuaXN0IiwiYSI6ImNrcGprZGFvcjExcGUybmprYjZkYzFyOWsifQ.vWflR8QYCqpVNlLhO_TR6g"
//     useEffect(() => {
//         if (map.current) return; // initialize map only once
//         map.current = new mapboxgl.Map({
//             container: mapContainer.current,
//             style: 'mapbox://styles/mapbox/streets-v11',
//             center: [lng, lat],
//             zoom: zoom,
//         });
//         let marker = new mapboxgl.Marker({
//             // color: "#FFFFFF", anchor: "bottom"
//             accessToken: mapboxgl.accessToken
//         })
//         .setLngLat([105.4758682, 21.1256643])
//         marker.addTo(map.current);
        
//     }, []);
//     // useEffect(() => {
//     //     if (map.current){
//     //     }
//     // }, [map])
//     return (
//         <div className="App">
//             <header className="App-header">
//             <div ref={mapContainer} className="map-container" style={{height: "100vh", width: "100%"}} />
//             </header>
//         </div>
//         );
// }
export {MapContainer};
