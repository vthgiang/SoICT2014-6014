import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
 
const AnyReactComponent = ({ text }) => <div>{text}</div>;
 
class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 20.468192,
      lng: 105.048307
    },
    zoom: 11
  };
 
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCkVQAqCoJU79mTctNsNmQLy9ME7qiTlfs', language: "en" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={20.468192}
            lng={105.048307}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
    );
  }
}
 
export {SimpleMap as SimpleMap};