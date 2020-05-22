import { Component, Inject, ViewEncapsulation, ViewChild ,ElementRef} from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { EditRideService } from '../edit-ride/edit-ride.service';
import { MatCheckbox } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DialogContentExampleDialog } from 'app/main/apps/e-commerce/create-ride/dialog-content-example-dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'e-commerce-edit-ride',
    templateUrl: './edit-ride.component.html',
    styleUrls: ['./edit-ride.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceEditRideComponent {
    showExtraToFields: boolean;
    editRideForm: FormGroup;
    showPrivateField :boolean;
    showPublicField :boolean
    Checked = true;
    isCheck = true;
    countries: any;
    getcountries: any;
    temp: Array<Object> = [];
    returnTemp: Array<Object> = [];
    selected : Array<Object> = [];
    minDate = new Date();
    //EstimatedDistanceVal: any;
    bikeBrandModels: any[];
    brandData: Array<Object> = [];
    htmlUrls = [];
    isDisabled = true;
    private _unsubscribeAll: Subject<any>;
    fromLocation: string;
    length: number;
    @ViewChild('search', { static: true }) private searchElementRef: ElementRef;

    @ViewChild('allSelected', { static: true }) private allSelected: MatCheckbox;

    halts = {
        HaltLocations: [{
          HaltID: "",
          Description: "",
          Name: "",
          Latitude: "",
          Longitude: ""
        }]
      }
      returnhalts = {
        ReturnHaltLocations: [{
          HaltID: "",
          Description: "",
          Name: "",
          Latitude: "",
          Longitude: ""
        }]
      }
      data = {
        Price: [
          {
            Price: "",
            Description: ""
    
          }
        ]
      }
    /**
     * Constructor
     *
     * @param {MatDialogRef<EcommerceCreateEventComponent>} matDialogRef
     * @param _data
     */
    constructor(private fb: FormBuilder, private _router: Router,
        private _editRideService: EditRideService,private dialog: MatDialog

    ) {
      this.editRideForm = this.fb.group({
        StartDate: [''],
        EndDate: [''],
        Price: this.fb.array([]),
        HaltLocations: this.fb.array([])
      }, { validator: this.checkDates });
        // Set the defaults
        this.editRideForm = this.createComposeForm();
        this.showExtraToFields = false;
        this._unsubscribeAll = new Subject();

        this.setHaltLocations();
       // this.setReturnHaltLocations();
        this.setPrice();
    }
    ngOnInit() {

        this.editRideForm.patchValue({
          RideType: 'Paid',
          InviteType: 'Public'
        });
        this._editRideService.getCountries()
            .then(data => {
                this.getcountries = data.Countries;
        });
        this._editRideService.onEditRideChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(editbikeBrandModels => {
      
              if (editbikeBrandModels.Status == 1) {
                this.bikeBrandModels = editbikeBrandModels.BikeBrandModels;
      
                this.bikeBrandModels.forEach(bikeBrand => {
                  bikeBrand.BikeModels.forEach(bikeModal => {
                    bikeModal.BrandID = bikeBrand.BrandID;
                  });
                });
              }            
            });

      let selectedRow = JSON.parse(localStorage.getItem("selectedRideRow"));
      if(selectedRow.InviteType == 1) {
        this.showPrivateField = true;
      }
      if(selectedRow.InviteType == 0){
        this.showPublicField = true;
      }
         
       // let Hs = selectedRow.HaltLocations.length;
       // console.log(selectedRow.HaltLocations.length);
        for(var i= 1; i < selectedRow.HaltLocations.length; i++) {
          this.setHaltLocations();  
        }
        for(var i=0; i< selectedRow.ReturnHaltLocations.length; i++) {
          this.setReturnHaltLocations();
        }
          this.editRideForm.patchValue(JSON.parse(localStorage.getItem("selectedRideRow")));

          this.temp = this.editRideForm.value.HaltLocations;
          this.returnTemp = this.editRideForm.value.ReturnHaltLocations;
          var self =  this;
          
          self.selected =[];
          if(selectedRow.Brands[0] == 'All'){
          
            this.bikeBrandModels.forEach(function(bikeBrand){
            
              bikeBrand.BikeModels.forEach(function(model){              
                    self.selected.push(model);               
                });
             
            });

            this.editRideForm.value.isSelected = true;
            this.allSelected.checked = true;

            this.editRideForm.patchValue({
              isSelected: true
            });
          }
          else{
   
            this.bikeBrandModels.forEach(function(bikeBrand){

              selectedRow.Brands.forEach(function(brand){
  
                brand.Models.forEach(function(model){
                  var bike =  bikeBrand.BikeModels.filter(item => item.BikeModelID == Number(model))[0];
                  if(bike != undefined){
                    self.selected.push(bike);
                   }
                });
               
              });
             
            });
          }
       
          this.htmlUrls = selectedRow.Images;
       
      // this.editRideForm.patchValue({
      //   HaltLocations: this.halts.HaltLocations
      // })
      // this.editRideForm.patchValue({
      //   HaltLocations : this.HaltLocations
      //   })
          // this.ReturnHaltLocations = ReturnHaltLocations;
          // this.length = this.ReturnHaltLocations.length;
          //  for(var i = 0 ; i < this.ReturnHaltLocations.length ; i++ ){
          //     this.setReturnHaltLocations();
          //  }
          // this.editRideForm.patchValue({
          //     ReturnHaltLocations : this.ReturnHaltLocations
          // })
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create compose form
     *
     * @returns {FormGroup}
     */
    createComposeForm(): FormGroup {
        return new FormGroup({
            RideID: new FormControl(''),
            UserID: new FormControl(''),
            AdminUserID: new FormControl(''),
            RideName: new FormControl(''),
            Description: new FormControl(),
            //Images: new FormControl([]),
            StartDate: new FormControl(''),
            StartTime: new FormControl(''),
            EndDate: new FormControl(''),
            EndTime: new FormControl(''),
            StartLocationName: new FormControl(''),
            StartLocationLat: new FormControl(''),
            StartLocationLong: new FormControl(''),
            DestinationLocationName: new FormControl(''),
            DestinationLocationLat: new FormControl(''),
            DestinationLocationLong: new FormControl(''),
            ReturnLocationName: new FormControl(''),
            ReturnLocationLat: new FormControl(''),
            ReturnLocationLong: new FormControl(''),
            ReturnEstimatedDistance: new FormControl(''),
            AdditionalInfo: new FormControl({value : '', disabled : true}),
            HaltLocations: this.fb.array([]),
            ReturnHaltLocations: this.fb.array([]),
            EstimatedDistance: new FormControl(''),
            EstimatedDistanceVal:new FormControl(''),
            RideType: new FormControl({value : '', disabled : true}),
            InviteType: new FormControl({value : '', disabled : true}),
            Price: this.fb.array([]),
            BrandModels: new FormControl(),
            /* BrandModels: new FormControl([
              {
                Modals: this.fb.array([]),
                BrandID: ''
              }]
            ),  */
            Groups: this.fb.array([]),
            Contacts: this.fb.array([]),
            CreatedBy: new FormControl(''),
            RidersCount: new FormControl(''),
            ShareLink: new FormControl(''),
            City: new FormControl(''),
            CountryID: new FormControl(''),
            TotalPrice: new FormControl({value : '', disabled : true}),
            isSelected: new FormControl(false),
            State:new FormControl('')
        });
    }

    checkDates(group: FormGroup) {
      if (group.controls.EndDate.value < group.controls.StartDate.value) {
        return { notValid: true }
      }
      return null;
    }
    
    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
    addNewHaltLocations() {
        let control = <FormArray>this.editRideForm.controls.HaltLocations;
        control.push(
          this.fb.group({
            HaltID: [''],
            Description: [''],
            Name: [''],
            Latitude: [''],
            Longitude: [''],
          })
        )
      }
      addNewReturnHaltLocations() {
        let control = <FormArray>this.editRideForm.controls.ReturnHaltLocations;
        control.push(
          this.fb.group({
            HaltID: [''],
            Description: [''],
            Name: [''],
            Latitude: [''],
            Longitude: [''],
          })
        )
      }
      addNewPrice() {
        let control = <FormArray>this.editRideForm.controls.Price;
        control.push(
          this.fb.group({
            Price: [''],
            Description: [''],
          })
        )
      }
      setPrice() {
        let control = <FormArray>this.editRideForm.controls.Price;
        this.data.Price.forEach(x => {
          control.push(this.fb.group({
            Price: x.Price,
            Description: x.Description
          }))
        })
        this.disableInputs();
      }

      disableInputs() {
        (<FormArray>this.editRideForm.get('Price'))
          .controls
          .forEach(control => {
            control.disable();
          })
      }
      deletePrice(index) {
        let control = <FormArray>this.editRideForm.controls.Price;
        control.removeAt(index)
      }
      setReturnHaltLocations() {
        let control = <FormArray>this.editRideForm.controls.ReturnHaltLocations;
        this.returnhalts.ReturnHaltLocations.forEach(x => {
          control.push(this.fb.group({
            HaltID: x.HaltID,
            Description: x.Description,
            Name: x.Name,
            Latitude: x.Latitude,
            Longitude: x.Longitude,
          }))
        })
      }
    
      deleteReturnHaltLocations(index) {
        let control = <FormArray>this.editRideForm.controls.ReturnHaltLocations;
        control.removeAt(index);
        this.returnTemp.splice(index, 1);
        this.editRideForm.patchValue({
          HaltLocations: this.returnTemp
        });
      }
    setHaltLocations() {
        let control = <FormArray>this.editRideForm.controls.HaltLocations;
        this.halts.HaltLocations.forEach(x => {
          control.push(this.fb.group({
            HaltID: x.HaltID,
            Description: x.Description,
            Name: x.Name,
            Latitude: x.Latitude,
            Longitude: x.Longitude,
          }))
        })
      }
      deleteHaltLocations(index) {
        let control = <FormArray>this.editRideForm.controls.HaltLocations;
        control.removeAt(index);
        this.temp.splice(index, 1);
        //this.createRideForm.patchValue({
        // HaltLocations: this.temp
        //});
      }
      tosslePerOne(all) {
        var list = [];
        //var data = this.createRideForm.get('BrandModels').value;
        //console.log(data);
        if (this.allSelected.checked) {
          this.allSelected.checked = false;
          return false;
        } else {
    
          this.bikeBrandModels.forEach(function (item) {
            item.BikeModels.forEach(function (bike) {
    
              list.push(bike);
    
            })
    
          });
    
        }
    
        if (this.editRideForm.get('BrandModels').value.length == list.length) {
          this.allSelected.checked = true;
        }
    
      }
      toggleAllSelection() {
        let bikes: any = this.bikeBrandModels[0];
        if (!this.editRideForm.value.isSelected) {
          var result: any = [];
          this.bikeBrandModels.forEach(function (obj) {
            obj.BikeModels.map(item => result.push(item));
          })
    
          this.editRideForm.controls.BrandModels
            .patchValue(result);
        } else {
          this.editRideForm.controls.BrandModels.patchValue([]);
        }
      }

      openDialog(targetPath, index) {

        if (targetPath == 'destLocation') {
    
          if (this.editRideForm.value.StartLocationName == undefined || this.editRideForm.value.StartLocationName == "") {
            alert('Please Select Start Location');
            return;
          }
        }
    
        if (targetPath == 'returnLocation') {
    
          if (this.editRideForm.value.StartLocationName == undefined || this.editRideForm.value.DestinationLocationName == undefined) {
            alert('Please Select Start and End Locations');
            return;
          }
        }
        if (targetPath == 'haltLocation') {
    
          if (this.editRideForm.value.StartLocationName == undefined ) {
            alert('Please Select Start Locations');
            return;
          }
        }
        if (targetPath == 'returnHaltLocation') {
    
          if (this.editRideForm.value.DestinationLocationName == undefined || this.editRideForm.value.DestinationLocationName == "") {
            alert('Please Select End Locations');
            return;
          }
        }
        if (targetPath == 'returnLocation' || targetPath == 'destLocation' || targetPath == 'haltLocation' || targetPath == 'returnHaltLocation') {
    
          if (this.editRideForm.value.StartLocationName == undefined || this.editRideForm.value.StartLocationName == "") {
            alert('Please Select Start Location');
            return;
          }
        }
    
        const dialogRef = this.dialog.open(DialogContentExampleDialog, {
          width: '800px', disableClose: true
        });
    
        dialogRef.afterClosed().subscribe(result => {
          //console.log(`Dialog result: ${result}`);
    
          if (result != undefined && result != "") {
            if (targetPath == 'startLocation') {
              this.editRideForm.patchValue({
                StartLocationName: result.address,
                StartLocationLat: result.latitude,
                StartLocationLong: result.longitude,
                State:localStorage.getItem("RideState")
              });
              console.log("Ride created State:",localStorage.getItem("RideState"));
            }
            if (targetPath == 'returnLocation') {
    
              if (this.editRideForm.value.StartLocationName == undefined || this.editRideForm.value.StartLocationName == "") {
                alert('Please select location');
                return;
              }
    
              this.editRideForm.patchValue({
    
                ReturnLocationName: result.address,
                ReturnLocationLat: result.latitude,
                ReturnLocationLong: result.longitude,
              });
    
              //var latitude1 = this.createRideForm.value.DestinationLocationLat;
              //var longitude1 = this.createRideForm.value.DestinationLocationLong;
              //var latitude2 = this.createRideForm.value.ReturnLocationLat;
              //var longitude2 = this.createRideForm.value.ReturnLocationLong;
              
              var startLatLong = this.editRideForm.value.DestinationLocationLat + "," + this.editRideForm.value.DestinationLocationLong;
              var endLatLong = this.editRideForm.value.ReturnLocationLat + "," + this.editRideForm.value.ReturnLocationLong;
    
              this.calcRoute(startLatLong, endLatLong, this.editRideForm.value.ReturnHaltLocations, "RetHalts");
    
    
              //var returnDistance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1, longitude1), new google.maps.LatLng(latitude2, longitude2));
    
              //this.createRideForm.patchValue({
                //ReturnEstimatedDistance: Math.round(returnDistance / 1000) + " km"
              //});
    
              //this.ReturnEstimatedDistanceVal = Math.round(returnDistance / 1000);
            }
            if (targetPath == 'destLocation') {
    
              if (this.editRideForm.value.StartLocationName == undefined || this.editRideForm.value.StartLocationName == "") {
                alert('Please select location');
                return;
              }
    
    
              this.editRideForm.patchValue({
                DestinationLocationName: result.address,
                DestinationLocationLat: result.latitude,
                DestinationLocationLong: result.longitude,
              });
    
    
              //var latitude1 = this.createRideForm.value.StartLocationLat;
              //var longitude1 = this.createRideForm.value.StartLocationLong;
              //var latitude2 = this.createRideForm.value.DestinationLocationLat;
              //var longitude2 = this.createRideForm.value.DestinationLocationLong;
             
              var startLatLong = this.editRideForm.value.StartLocationLat + "," + this.editRideForm.value.StartLocationLong;
              var endLatLong = this.editRideForm.value.DestinationLocationLat + "," + this.editRideForm.value.DestinationLocationLong;
    
              this.calcRoute(startLatLong, endLatLong, this.editRideForm.value.HaltLocations, "DestHalts");
              //var estimateDistance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1, longitude1), new google.maps.LatLng(latitude2, longitude2));
    
              //this.createRideForm.patchValue({
    
                //EstimatedDistance: Math.round(estimateDistance / 1000) + " km"
              //});
    
              //this.EstimatedDistanceVal = Math.round(estimateDistance / 1000);
    
              //alert(distance);
            }
            if (targetPath == 'haltLocation') {
              if (this.editRideForm.value.StartLocationName == undefined || this.editRideForm.value.StartLocationName == "") {
                alert('Please select location');
                return;
              }
              var item = {
                "HaltID": "Halt" + index,
                "Description": "A break ",
                "Name": result.address,
                "Latitude": result.latitude,
                "Longitude": result.longitude
              }
              if (!this.temp[index]) {
                this.temp.push(item);
              }
              else {
                this.temp[index] = item;
              }
              this.editRideForm.patchValue({
                HaltLocations: this.temp
              });
    
            }
            if (targetPath == 'returnHaltLocation') {
    
              if (this.editRideForm.value.StartLocationName == undefined || this.editRideForm.value.StartLocationName == "") {
                alert('Please select location');
                return;
              }
              var item = {
                "HaltID": "Halt" + index,
                "Description": "A break ",
                "Name": result.address,
                "Latitude": result.latitude,
                "Longitude": result.longitude
              }
    
              if (!this.returnTemp[index]) {
                this.returnTemp.push(item);
              }
              else {
                this.returnTemp[index] = item;
              }
              this.editRideForm.patchValue({
                ReturnHaltLocations: this.returnTemp
              });
            }
          }
        });
      }
    
      
  calcRoute(startLatLong, endLatLong, wayPoints, fromLocation) {

    var wayPointsObj : any =[];
    wayPoints.forEach(function(wayPoint){
      var way = {
        location: wayPoint.Latitude + "," + wayPoint.Longitude,
        stopover:true
      }
      wayPointsObj.push(way);
    })
    var directionsService : any = new google.maps.DirectionsService();
   
    var request = {
        // from: Blackpool to: Preston to: Blackburn
        origin: startLatLong, 
        destination: endLatLong, 
        waypoints: wayPointsObj,
        optimizeWaypoints: false,
        travelMode: 'DRIVING',
    };
    var self = this;
    self.fromLocation = fromLocation;
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        //directionsDisplay.setDirections(response);
        //var route = response.routes[0];
       
        self.computeTotalDistance(response, self.fromLocation);
      } else {
        alert("directions response "+status);
      }
    });
  }

  computeTotalDistance(result,fromLocation) {
    var totalDist = 0;
    var totalTime = 0;
    var myroute :any = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
      totalDist += myroute.legs[i].distance.value;
      totalTime += myroute.legs[i].duration.value;
    }
    totalDist = totalDist / 1000;
    console.log( "total distance is: " +
     totalDist +
      " km<br>total time is: " 
      + (totalTime / 60).toFixed(2) +
       " minutes");
    if(fromLocation == 'DestHalts'){
      this.editRideForm.patchValue({
            EstimatedDistance:totalDist + " km",
            EstimatedDistanceVal: totalDist + "km"
      });

      //this.EstimatedDistanceVal = totalDist;
    }
    if(fromLocation == 'RetHalts'){
        this.editRideForm.patchValue({
            ReturnEstimatedDistance:totalDist + " km"
        });

        //this.ReturnEstimatedDistanceVal = totalDist;
    }
  } 

  onEditRide() {

    this.editRideForm.value.UserID = Number(localStorage.getItem('AdminUserID'));
    this.editRideForm.value.CreatedBy = Number(localStorage.getItem('AdminUserID'));

    this.editRideForm.removeControl('BrandModels');    
    this.editRideForm.removeControl('Images');    
    this.editRideForm.removeControl('RideType');    
    this.editRideForm.removeControl('Price');   
    this.editRideForm.removeControl('TotalPrice');    
    this.editRideForm.removeControl('InviteType');    
    this.editRideForm.removeControl('AdditionalInfo');    

    this._editRideService.editRide(this.editRideForm.value).then((data) => {

      // Show the success message
      if (data.Status == 1) {
        //let result = data.VendorDetails;
        alert("Ride updated successfully");
        this._router.navigate(['apps/e-commerce/rides']);
      }
      else
        alert(data.Message);
    });
  }
 
}
