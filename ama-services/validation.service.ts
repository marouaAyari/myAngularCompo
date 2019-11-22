import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  public validate(list, toCheck) {  
    var listToCheck = list.map((elt) => {
      if(elt[toCheck]!=null)
      return elt[toCheck].toUpperCase().trim();
    }); 
    const uniq = new Set(listToCheck); 
    const backtoList = Array.from(uniq);
    if (backtoList.length != listToCheck.length) {
      return true;
    }
    return false;
  }
}
