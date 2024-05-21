import 'leaflet/dist/leaflet.css';
import {TileLayer, useMap} from 'react-leaflet';
import React, {useEffect, useState} from 'react';

const PickInMap = (props) => {
  let {lat, lng, listOrders} = props;
  const [marker, setMarker] = useState([]);
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 11);
    marker.forEach(marker => {
      if (lat === marker.getLatLng().lat && lng === marker.getLatLng().lng)
        marker.openPopup();
    });
  }, [lat, lng]);

  const transportType = {
    1: 'Giao hàng',
    2: 'Nhận hàng'
  }

  const LIST_COLOR = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'gray', 'brown'];

  // draw line between 2 points
  let drawLine = (lat1, lng1, lat2, lng2, color = 'red', title = 'Đường đi') => {
    let line = L.polyline([[lat1, lng1], [lat2, lng2]],
      {
        color
      }
    );
    line.addTo(map);
    line.bindTooltip(title, {permanent: true, direction: 'center'})
    return line;
  }

  useEffect(() => {
    // get current line in map
    let currentLines = map._layers;
    for (let key in currentLines) {
      if (currentLines[key]._latlngs) {
        map.removeLayer(currentLines[key]);
      }
    }
    // draw line between orders
    props.listVehicle.forEach(async (vehicle, index) => {
      let orders = props.schedule[vehicle._id]?.orders;
      !orders && (orders = []);
      for (let i = 0; i < orders.length - 1; i++) {
        let order1 = listOrders.find(order => order._id === orders[i]);
        let order2 = listOrders.find(order => order._id === orders[i + 1]);
        drawLine(order1.lat, order1.lng, order2.lat, order2.lng, LIST_COLOR[index], '' + (i + 1));
      }
    });
    map.fitBounds(listOrders.map(order => [order.lat, order.lng]));
  }, [props.state])
  useEffect(() => {
    let list = listOrders.map(order => L.marker([order.lat, order.lng],
      {
        title: order.code + ' - ' + order.customer.name + ' - ' + transportType[order.transportType],
        icon: order.transportType === 1 ? L.icon({
          iconUrl: '/image/delivery.png',
          iconSize: [40, 40]
        }) : L.icon({
          iconUrl: '/image/receive.png',
          iconSize: [40, 40]
        })
      }));
    setMarker(list);
    map.fitBounds(list.map(marker => marker.getLatLng()));
  }, []);

  useEffect(() => {
    marker.forEach(marker => {
      marker.addTo(map).bindPopup(marker.options.title);
    });
    return () => {
      marker.forEach(marker => {
        map.removeLayer(marker);
      });
    }
  }, [marker]);
  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </>
  )
}

export default PickInMap
