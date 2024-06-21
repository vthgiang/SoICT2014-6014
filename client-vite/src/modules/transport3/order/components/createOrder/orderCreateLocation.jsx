import React, {Component, useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'
import '../order.css'
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import {
  MapContainer,
  TileLayer,
  useMap, Marker, Popup
} from 'react-leaflet';
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch';
import {OrderActions} from '@modules/transport3/order/redux/actions.js';

function OrderCreateLocation(props) {
  const {handleAddressChange, customerAddress} = props;

  const map = useMap();
  const provider = new OpenStreetMapProvider({
    params: {
      countrycodes: 'vn',
      addressdetails: 1
    }
  });
  const [marker, setMarker] = useState(null);
  const [latlng, setLatlng] = useState(null);
  const searchControl = new GeoSearchControl({
    provider: provider,
    maxMarkers: 1,
  });

  useEffect(() => {
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);

  useEffect(() => {
    marker && map.setView([marker.y, marker.x], 16);
  }, [marker]);

  useEffect(() => {
    if (latlng) {
      props.getAddressFromLatLng(latlng.lat, latlng.lng);
    }
  }, [latlng]);

  useEffect(() => {
    if( props.orders.address && latlng){
      let newMarker = {
        x: latlng.lng,
        y: latlng.lat,
        label: props.orders.address,
      }

      map.eachLayer(layer => typeof layer.getLatLng === 'function' && layer.setLatLng(latlng));
      searchControl.addMarker(newMarker);
      handleAddressChange(newMarker);
      setMarker(newMarker);
    }
  }, [props.orders.address]);
  useEffect(() => {
    if (customerAddress && props.address === '') {
      provider.search({query: customerAddress,}).then((result) => {
        if (result.length > 0) {
          searchControl.addMarker(result[0]);
          setMarker(result[0]);
          handleAddressChange(result[0]);
        }
      });
    } else if (props.orders.address) {
      let newMarker = {
        x: props.lng,
        y: props.lat,
        label: props.orders.address,
      }
      searchControl.addMarker(newMarker);
      handleAddressChange(newMarker);
      setMarker(newMarker);
    }
  }, []);

  // add marker on right click
  map.on('click', function (e) {
    setLatlng(e.latlng);
  });

  map.on('geosearch/showlocation', function (e) {
    handleAddressChange(e.location);
  });

  return (
    <>
      <provider/>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </>
  )
}

function mapStateToProps(state) {
  const {orders} = state;
  return {orders}
}

const mapDispatchToProps = {
  getAddressFromLatLng: OrderActions.getAdressFromLatLng
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(OrderCreateLocation))
