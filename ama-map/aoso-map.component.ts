import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'aoso-map',
  templateUrl: './aoso-map.component.html',
  styleUrls: ['./aoso-map.component.scss']
})
export class AosoMapComponent implements OnInit {

  
      @Input() adressType: string;
      @Output() setAddress: EventEmitter<any> = new EventEmitter();
      @ViewChild('addresstext',{static:true}) addresstext: any;
  
      autocompleteInput: string;
      queryWait: boolean;
  
      constructor() {
      }
  
      ngOnInit() {
      }
  
      ngAfterViewInit() {
          this.getPlaceAutocomplete();
      }
  
      private getPlaceAutocomplete() {
        //   const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
        //       {
        //           componentRestrictions: { country: 'US' },
        //           types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
        //       });
        //   google.maps.event.addListener(autocomplete, 'place_changed', () => {
        //       const place = autocomplete.getPlace();
        //       this.invokeEvent(place);
        //   });
      }
  
      invokeEvent(place: Object) {
          this.setAddress.emit(place);
      }
  
  }