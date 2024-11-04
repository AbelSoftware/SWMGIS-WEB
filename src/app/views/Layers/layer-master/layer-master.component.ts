import { Component, Injectable, TemplateRef, ViewChild } from '@angular/core';
import { ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent, ModalToggleDirective, TabDirective, TabsListComponent, TabPaneComponent, TabPanelComponent, TabContentComponent, TabContentRefDirective, TabsModule, NavComponent, NavModule, ButtonGroupModule, ButtonGroupComponent } from '@coreui/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalService} from '../../../Services/ModelToggle/modal.service'
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { LayerListComponent } from "../layer-list/layer-list.component";
import { CreateLayerComponent } from "../create-layer/create-layer.component";
import { EditLayerComponent } from "../edit-layer/edit-layer.component";
import { RouterModule } from '@angular/router';
import { DataService } from '../../../Services/ModelToggle/modal.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-layer-master',
  standalone: true,
  imports: [RouterModule,CommonModule, NavModule, ModalToggleDirective, ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent, LayerListComponent, CreateLayerComponent, EditLayerComponent],
  templateUrl: './layer-master.component.html',
  styleUrl: './layer-master.component.scss'
})
export class LayerMasterComponent {

  activeTab: string = 'home'; // Default active tab

  setActiveTab(tab: string) {
    this.activeTab = tab;

    
  }
  isLayer = false;

  constructor(private modalService: ModalService,private DataService : DataService) {}

  ngOnInit() {
    console.log(this.isLayer);
    
    this.modalService.modalToggle$.subscribe((visible:any) => {
      this.isLayer = visible;
      console.log(this.isLayer)
    });

    this.DataService.currentValue.subscribe((visible:any) => {
      console.log(visible)
      if(visible){
        this.activeTab = 'Edit';
      }
      
    });
  }

  toggleModel() {
    this.isLayer = !this.isLayer;
    this.modalService.toggleModal(this.isLayer);
    console.log(this.isLayer)
  }

}
