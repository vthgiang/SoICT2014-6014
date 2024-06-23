import 'leaflet/dist/leaflet.css';
import {TileLayer, useMap} from 'react-leaflet';
import React, {useEffect, useState} from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';

const PickInMap = (props) => {
  let {lat, lng, listOrders, listVehicle, listStocks, nearestDepots, typeRoute} = props;
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

  // draw route between orders
  const drawRoute = (lat1, lng1, lat2, lng2, color = 'red') => {
    let route = L.Routing.control({
      waypoints: [
        L.latLng(lat1, lng1),
        L.latLng(lat2, lng2)
      ],
      lineOptions: {
        styles: [{color: color}]
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      showAlternatives: false,
      createMarker: () => null
    });
    route.on('routesfound', function (e) {
      let routes = e.routes;
      let summary = routes[0].summary;
      let distance = (summary.totalDistance / 1000).toFixed(2);
    });
    route.addTo(map);
  };

  const __draw = (lat1, lng1, lat2, lng2, color = 'red', title = 'Đường đi') => {
    if (typeRoute) {
      drawRoute(lat1, lng1, lat2, lng2, color);
    } else {
      drawLine(lat1, lng1, lat2, lng2, color, title);
    }
  }

  useEffect(() => {
    // get current line in map
    let currentLines = map._layers;
    for (let key in currentLines) {
      // remove line & route
      if (currentLines[key]._latlngs || currentLines[key]._waypoints) {
        map.removeLayer(currentLines[key]);
      }
    }

    // draw line between orders
    listVehicle.forEach(async (vehicle, index) => {
      let orders = props.schedule[vehicle._id]?.orders;
      !orders && (orders = []);
      if (orders.length === 1) {
        let stock = nearestDepots.find(depot => depot.vehicle === vehicle._id)?.stock;
        if (stock) {
          __draw(stock.lat, stock.lng, listOrders.find(order => order._id === orders[0]).lat, listOrders.find(order => order._id === orders[0]).lng, LIST_COLOR[index], 'Xuất kho');
        }
      }
      for (let i = 0; i < orders.length - 1; i++) {
        let order1 = listOrders.find(order => order._id === orders[i]);
        if (i === 0) {
          let stock = nearestDepots.find(depot => depot.vehicle === vehicle._id)?.stock;
          if (stock) {
            __draw(stock.lat, stock.lng, order1.lat, order1.lng, LIST_COLOR[index], 'Xuất kho');
          }
        }
        let order2 = listOrders.find(order => order._id === orders[i + 1]);
        if (i === orders.length - 2) {
          let stock = nearestDepots.find(depot => depot.vehicle === vehicle._id)?.stock;
          if (stock) {
            __draw(order2.lat, order2.lng, stock.lat, stock.lng, LIST_COLOR[index], 'Nhập kho');
          }
        }
        __draw(order1.lat, order1.lng, order2.lat, order2.lng, LIST_COLOR[index], '' + (i + 1));
      }
    });
    let listBounds = listOrders.map(order => [order.lat, order.lng]);
    listBounds = listBounds.concat(listStocks.map(stock => [stock.lat, stock.lng]));
    map.fitBounds(listBounds);
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
    let stockMarker = listStocks.map(stock => stock.lat && L.marker([stock.lat, stock.lng],
      {
        title: `${stock.code} - Kho ${stock.name} - ${stock.address}`,
        icon: L.icon({
          iconUrl: '/image/warehouse.png',
          iconSize: [40, 40]
        })
      }));
    stockMarker = stockMarker.filter(marker => marker);
    list = list.concat(stockMarker);
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
