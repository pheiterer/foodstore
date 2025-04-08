import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { icon, LatLng, LatLngExpression, LatLngTuple, LeafletEvent, LeafletMouseEvent, map, Map, marker, Marker, tileLayer } from 'leaflet';
import { LocationService } from 'src/app/services/location.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input()
  order!: Order;
  private readonly DEFAULT_ZOOM = 16;
  private readonly MARKER_ICON = icon({
    iconUrl: 'https://img.wattpad.com/2e81be56eb640a3183bb5b0924c1ced061eb9037/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f7433376233456f6430714c7651773d3d2d3732353236353131392e313539393662383238623133353339663633373237323136363130322e676966',
    iconSize: [70, 65],
    iconAnchor: [70, 40],
  })
  private readonly DEFAULT_LATLNG: LatLngTuple = [13.75, 21.62];

  @ViewChild('map', {static:true})
  mapRef!: ElementRef;
  map!: Map;
  currentMarker!: Marker;

  constructor(private locationService: LocationService) { }

  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap(){
    if(this.map) return;

    this.map = map(this.mapRef.nativeElement, {
      attributionControl: false
    }).setView(this.DEFAULT_LATLNG, 1);

    tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

    this.map.on('click', (e:LeafletMouseEvent) => {
      this.setMarker(e.latlng);
    });
  }

  findMyLocation(){
    this.locationService.getCurrentLocation().subscribe({
      next: (latLng) => {
        this.setMarker(latLng);
        this.map.setView(latLng, this.DEFAULT_ZOOM);
        this.map.panTo(latLng);
      },
      error: (error) => {
        console.error('Error getting location:', error);
      }
    });
  }

  setMarker(latLng: LatLngExpression){
    this.addressLatLng = latLng as LatLng;
    if(this.currentMarker){
      this.currentMarker.setLatLng(latLng);
      return;
    } 
      
    this.currentMarker = marker(latLng, {
      draggable: true,
      icon: this.MARKER_ICON
    }).addTo(this.map);

    this.currentMarker.on('dragend', (e: LeafletEvent) => {
      const marker = e.target as Marker;
      const position = marker.getLatLng();
      this.addressLatLng = position;
    });
  }

  set addressLatLng(latLng: LatLng){
    latLng.lat = parseFloat(latLng.lat.toFixed(8));
    latLng.lng = parseFloat(latLng.lng.toFixed(8));
    this.order.addressLatLng = latLng;
    console.log('addressLatLng', this.order.addressLatLng);
  }
}