
import { Component,ViewChild, ElementRef, NgZone, } from '@angular/core';

import { MapsAPILoader, MouseEvent } from '@agm/core';

@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'dialog-content-example-dialog.html',
  })
  export class DialogContentExampleDialog {
    title: string = 'AGM project';
    latitude: number;
    longitude: number;
    zoom: number;
    address: string;
    city: string;
    state:string
    private geoCoder; fullAddress: any;
  
    @ViewChild('search', { static: true }) private searchElementRef: ElementRef;
    constructor(
      private mapsAPILoader: MapsAPILoader, private ngZone: NgZone
    ) {
  
    }
    ngOnInit(): void {
      this.mapsAPILoader.load().then(() => {
        this.setCurrentLocation();
        this.geoCoder = new google.maps.Geocoder;
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
        autocomplete.setFields(
          ['address_components', 'geometry', 'icon', 'name']);
        //autocomplete.bindTo('bounds', map);
        /* let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ['(cities)']
        }); */
        //autocomplete.setFields(['address_component']);
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
  
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            //set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.getAddress(this.latitude, this.longitude, place.name);
            this.zoom = 13;
          });
        });
      });
  
    }
  
    // Get Current Location Coordinates
    private setCurrentLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.getAddress(this.latitude, this.longitude);
          this.zoom = 17;
        });
      }
    }
  
    markerDragEnd($event: MouseEvent) {
      //console.log($event);
      this.latitude = $event.coords.lat;
      this.longitude = $event.coords.lng;
      this.getAddress(this.latitude, this.longitude, null);
    }
  
    getAddress(latitude, longitude, address?) {
      this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
        // console.log(results);
        // console.log(status);
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 13;
            var data = {
              address: address || results[0].formatted_address,
              latitude: latitude,
              longitude: longitude
            };
            this.fullAddress = data;
            var State: string;
            this.address = address || results[0].formatted_address;
            for (var i = 0; i < results.length; i++) {
              if (results[i].types[0] === "administrative_area_level_1") {
                this.state = results[i].address_components[0].long_name;
                console.log("state:" + this.state);
                localStorage.setItem("RideState",this.state);
              }
            }
                       

            for (var i = 0; i < results.length; i++) {
              if (results[i].types[0] === "locality") {
                this.city = results[i].address_components[0].short_name;
                //var state = results[i].address_components[2].short_name;
                console.log("city:" + this.city);
                localStorage.setItem("RideCity",this.city);
                //$("input[name='location']").val(city + ", " + state);
              }
            }

          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
  
      });
    }
  }