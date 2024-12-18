import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalToggleSubject = new Subject<boolean>();
  modalToggle$ = this.modalToggleSubject.asObservable();
  toggleModal(visible: boolean) {
    this.modalToggleSubject.next(visible);
  }
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
    Param : any = ''
  private valueSource = new BehaviorSubject<string>(this.Param);
  currentValue = this.valueSource.asObservable();

  changeValue(value: string) {
    this.valueSource.next(value);
  }
}
