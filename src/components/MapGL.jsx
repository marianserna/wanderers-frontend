import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import CityPin from '../components/CityPin';
import PopupContent from '../components/PopupContent';

@inject('WanderersStore')
@observer
export default class MapGL extends Component {
  renderPlaces = () => {
    const { WanderersStore } = this.props;
    return WanderersStore.places.map(place => {
      return (
        <Marker
          key={place.id}
          latitude={parseFloat(place.lat)}
          longitude={parseFloat(place.lon)}
        >
          <CityPin
            onClick={() => {
              WanderersStore.updatePopupPlace(place);
            }}
          />
        </Marker>
      );
    });
  };

  renderPopup = () => {
    const { WanderersStore } = this.props;
    const popupPlace = WanderersStore.popupPlace;

    if (!popupPlace) {
      return null;
    }

    return (
      <Popup
        tipSize={5}
        anchor="top"
        longitude={parseFloat(popupPlace.lon)}
        latitude={parseFloat(popupPlace.lat)}
        onClose={() => WanderersStore.updatePopupPlace(null)}
      >
        <PopupContent place={popupPlace} />
      </Popup>
    );
  };

  render() {
    const { WanderersStore } = this.props;
    const viewport = WanderersStore.viewport;

    return (
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken="pk.eyJ1IjoibWFyaWFuc2VybmEiLCJhIjoiY2o0dm8wcGpqMHZ2YzJxcjV0ZDFvbTM5dSJ9.W5BkzLIaUIZcVuiSFbVTsw"
        onViewportChange={viewport => {
          // From Mapbox: Allows map to display updated viewport (drag & zoom)
          WanderersStore.viewport = viewport;
        }}
        mapStyle="mapbox://styles/marianserna/cj9dl49je6ab72smd6pt33qwh"
      >
        {this.renderPlaces()}
        {this.renderPopup()}
      </ReactMapGL>
    );
  }
}