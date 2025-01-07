import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';

import { Draw } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import { Map, View } from 'ol';
import { Geometry } from 'ol/geom';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {MapServiceService} from '../../Services/mapService/map-service.service'
import { EditControl } from '../openlayer-map/EditControl';
import {DropdownController} from '../openlayer-map/DropdownController'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {OpenlayerMapComponent} from '../openlayer-map/openlayer-map.component'
import { ExportService } from '../../Services/Export-service/export.service';
import { LayersApiService } from '../../Services/layers-services/layers-api.service';

@Component({
  selector: 'app-drawing-tool',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './drawing-tool.component.html',
  styleUrl: './drawing-tool.component.scss'
})
export class DrawingToolComponent {

  @Input() selectedValue: Map | any = null;
  @Input() vector: Map | any = null;

  draw!: Draw;
  selectedType = 'Point';
  fillColor = '#ffffff'; // Default fill color
  outlineColor = '#000000'; // Default outline color
  outlineWidth = 1; // Default outline width
  transparency = 1; // Default transparency (1 = opaque)
  map !: Map
  drawingTypes = ['Point', 'LineString', 'Polygon'];
  @ViewChild('drawingModal', { static: true }) drawingModal!: TemplateRef<any>; // Reference to modal template

  selected: any = ''
  constructor(private layerService : LayersApiService,private service : MapServiceService,private modalService: NgbModal,private openlayer:OpenlayerMapComponent,private xlsxService:ExportService){}

  ngOnInit():void{
    

    const editControl = new EditControl(this.service.map,()=>{
      this.openModal(this.drawingModal)
    });
    this.service.map.addControl(editControl);

    let req = {
      "flag":"GetAllLayerName",
      "Spname":"usp_TableList",
      "data":""
    
  }
  let options :any 
  this.layerService.dbQuery(req).subscribe(resp=>{
    options = resp.data.map((x:any)=>{
      return {TableName:x.TableName,LayerType : x.LayerType}
    })

    const dropdownControl = new DropdownController(this.map, options, (selectedOption) => {
      
      this.selected = JSON.parse(selectedOption)
      let req = {
        "flag":"getAllGeom",
        "Spname":"spGeoJson_StreetLightPole",
        "data":{
            "table":this.selected.TableName
        }
     }
     
      this.openlayer.getGeometryLine(req)
      console.log('Selected:', this.selected);
      this.selectedType = this.selected.LayerType
      this.onTypeChange()
      // Handle selection change
    });

    this.service.map.addControl(dropdownControl);
    
  })
  

    
  }
  

  @Output() messageToParent = new EventEmitter<any>();

  sendMessage() {
    this.messageToParent.emit('Hello from Child');
  }

  addDrawingInteraction() {
    const drawInteraction = new Draw({
      source: this.vector, // Make sure this is the correct source for your vector layer
      type: 'Polygon', // Line drawing
    });
  
    // Add a listener to the 'drawend' event to keep the drawn feature on the map
    drawInteraction.on('drawend', (event) => {
      const feature = event.feature; // The drawn feature
  
      // Optionally, you can set a style for the feature here
      feature.setStyle(
        new Style({
          stroke: new Stroke({
            color: 'blue', // Set the line color
            width: 3, // Set the line width
          }),
        })
      );
  
      // The feature is automatically added to the vectorSource, so nothing extra is needed here
    });
    this.messageToParent.emit(this.draw);
    
  }

  onTypeChange() {
    // this.addDrawingInteraction();
    
    this.messageToParent.emit({Type:this.selectedType,selected:this.selected.TableName,LayerType:this.selected.LayerType});
  }

  

  

  onEdit() {
    console.log('Edit button clicked!');
    // Call your editing logic here
  }


  openModal(modalContent: TemplateRef<any>) {
    this.modalService.open(modalContent);
  }
  saveChanges() {
    let payload = {
      Type : this.selectedType,
      Fill : this.fillColor,
      Outlinecolor : this.outlineColor,
      outlineWidth : this.outlineWidth,
      Tranparency : this.transparency
    }
    this.service.enableDrawing(payload)  
    this.modalService.dismissAll(); // Close the modal after saving    
  }
  closeDrawing() {
    // Logic to save changes
    this.service.disableDrawing()
    this.modalService.dismissAll(); // Close the modal after saving    
  }
  ExportData(){
    this.xlsxService.exportAsExcelFile(this.service.DrawingData,'Coordinates')
  }

  
}
