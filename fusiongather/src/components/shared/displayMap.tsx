'use client'

import React, { Ref, useEffect, useRef } from 'react';
import { useState } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from 'mapbox-gl';
import ReactMapGL, { Marker, Map, Popup, NavigationControl, GeolocateControl, MapRef } from "react-map-gl";
import Geocoder from './geocoder';

export default function DisplayMap(props: any) {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGhhbmdnYTNxM3EzcSIsImEiOiJjbHI4bHlwZm8yZDkzMmp0YWhjZHE3bDR3In0.KfeyM_Nn0qYA7NxqC3PC5A';
    console.log(props.currentCoords)
  const [viewport, setViewport] = useState({
    latitude: props.currentCoords[1] == 0 ? 14.3154241771087 : props.currentCoords[1],
    longitude: props.currentCoords[0] == 0 ? 108.339537475899 : props.currentCoords[0],
    zoom: props.currentCoords[0] == 0 ? 4 : 16
  });

  function onSearchLocation(result: any) {
    console.log(result.coords)
    console.log(result.location)
    setViewport({
      latitude: result.coords[1],
      longitude: result.coords[0],
      zoom: viewport.zoom
    })
    props.setLocation(result.location, result.coords[0], result.coords[1])
  }

  function onDragMarker(event: any) {
    setViewport({
      latitude: event.lngLat.lat,
      longitude: event.lngLat.lng,
      zoom: viewport.zoom
    })
    console.log(viewport)
    props.setLocation("", event.lngLat.lng, event.lngLat.lat)
  }

  const mapRef: Ref<MapRef> = useRef({} as MapRef);

  return (
    <div className="flex justify-center items-center h-[50vh]">
      <Map
        ref={mapRef}
        initialViewState={viewport}
        mapStyle="mapbox://styles/mapbox/standard"
        mapboxAccessToken={mapboxgl.accessToken}
      
      >
        <Marker longitude={viewport.longitude} 
                latitude={viewport.latitude}
                draggable={
                  props.status == "INFO" ? false : true
                }
                onDragEnd={onDragMarker}
                >         
        </Marker>
        <NavigationControl position='bottom-right' />
        {
          props.status == "INFO" ? null : <GeolocateControl 
          position='top-left'
          trackUserLocation={true}
          onGeolocate={(event) => {
            setViewport({
              longitude: event.coords.longitude,
              latitude: event.coords.latitude,
              zoom: viewport.zoom
            });
            props.setLocation("geolocate", event.coords.longitude, event.coords.latitude)
          }}
          />
        }
        {
          props.status == "INFO" ? null : <Geocoder onSearchLocation={onSearchLocation} />
        }       
      </Map>
    </div>
  );
}
