import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios'
import './mapstyles.css';
function MapContainer(props) {

    const {locations, driverLocation, nonDirectLocations, zoom, indexComponent, mapHeight, callBackLatLng} = props;

    let routeId = "route" + indexComponent;

    const mapContainer = useRef(null);
    // const map = useRef(null);

    let delayLoadDirect = useRef(null);

    let currentMap = useRef(null);

    const [checkMapLoaded, setCheckMapLoaded] = useState(0); 
    
    const [center, setCenter] = useState({lng: 100, lat: 20})

    const [direction, setDirection] = useState();

    const [listMarker, setListMarker] = useState([]);


    mapboxgl.accessToken = "pk.eyJ1Ijoia2llbm5kdHZuaXN0IiwiYSI6ImNrcGprZGFvcjExcGUybmprYjZkYzFyOWsifQ.vWflR8QYCqpVNlLhO_TR6g"

    useEffect(() => {
        
        if (delayLoadDirect.current){
            clearTimeout(delayLoadDirect.current);
        }
        delayLoadDirect.current = setTimeout(() =>{
        if (!currentMap.current){
            if (!mapContainer.current) return;
            let center = {
                lat: 21.022177879987648, 
                lng: 105.81717955779875
            };
            if (driverLocation && driverLocation.length!==0){
                center = driverLocation[0].location;
            }
            else {
                if (locations && locations.length !==0){
                    center = locations[0].location;
                }
                else {
                    if (nonDirectLocations && nonDirectLocations.length!==0){
                        center = nonDirectLocations[0].location;
                    }
                }
            }
            currentMap.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: center,
                zoom: zoom?zoom:8,
            });
    
            currentMap.current.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');

            let nav = new mapboxgl.NavigationControl();
            currentMap.current.addControl(nav, 'bottom-right');
            
            // setMap(currentMap.current);
            setCheckMapLoaded(0);
            console.log("da tao map");
        }
        currentMap.current.once('idle',function(){
            currentMap.current.resize()
            })

        // call back geocode khi click map
        if (callBackLatLng){
            currentMap.current.on('click', function (e) {
                callBackLatLng({
                    lat: e.lngLat.lat, 
                    lng: e.lngLat.lng
                });
                currentMap.current.flyTo({
                    center: e.lngLat
                });
                
            });
        }
        // Xóa bỏ marker cũ
        if (listMarker && listMarker.length!==0){
            listMarker.map(marker => {
                marker.remove();
            })
        }
        // Xóa bỏ direction cũ
        while (currentMap.current.getSource(routeId)){                
            currentMap.current.removeLayer(routeId);
            currentMap.current.removeSource(routeId)
            console.log("da xoa route cu");
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
                .addTo(currentMap.current)
                .togglePopup();
                newListMarker.push(marker);
            })
        }
        let listGeocodeDirection="";
        let countAddress = 0;
        if (driverLocation && driverLocation.length!==0){
            driverLocation.map((item,index) => {
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
                .addTo(currentMap.current)
                .togglePopup();
                newListMarker.push(marker);
                listGeocodeDirection+=item.location.lng + "," + item.location.lat + ";";
                countAddress++;
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
                .addTo(currentMap.current)
                .togglePopup();
                newListMarker.push(marker);
                listGeocodeDirection+=item.location.lng + "," + item.location.lat + ";";
                countAddress++;
            })
        }
        setListMarker(newListMarker);
        if (listGeocodeDirection !== "" && countAddress >1){

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
    }, [props,  mapContainer.current])

    useEffect(() => {     
        if (currentMap.current){

            currentMap.current.on('load', () => {
                
                setCheckMapLoaded(1);
                console.log("da vao loadddddddddddddd");
                currentMap.current.resize();
            })
        }    
        if (direction && currentMap.current){            
            // if (currentMap.current.getSource("route")) {
            //     currentMap.current.removeLayer("route");
            //     currentMap.current.removeSource("route")
            // } else{       
                console.log(checkMapLoaded, " hahahahah")
                if (checkMapLoaded === 1){
                    while (currentMap.current.getSource(routeId)){                
                        currentMap.current.removeLayer(routeId);
                        currentMap.current.removeSource(routeId)
                        console.log("da xoa route cu");
                    }
                    currentMap.current.addLayer({
                        "id": routeId,
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
                            "line-width": 6,
                            "line-opacity": 0.8
                        }
                    });
                    console.log("okkkk")
                    
                };
                }
                
            
        // }
        // return removeLayer('route');
    }, [direction, currentMap.current, checkMapLoaded, props])
    return (
        <div style={{height: mapHeight?mapHeight:"400px", width: "100%"}}>
            <div ref={mapContainer} className="map-container" style={{height: "100%", width: "100%"}} />

        </div>
        );
}
export {MapContainer};
