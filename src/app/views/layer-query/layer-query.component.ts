import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapServiceService } from 'src/app/Services/mapService/map-service.service';

import { LayerQuery } from '../Controller/layerQueryController';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayersApiService } from 'src/app/Services/layers-services/layers-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExportService } from 'src/app/Services/Export-service/export.service';
import { RouterLink } from '@angular/router';
import { PaginationComponent, PageItemDirective, PageLinkDirective, AlertComponent } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
@Component({
  selector: 'app-layer-query',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,PaginationComponent,AlertComponent, IconDirective,
    PageItemDirective,
    PageLinkDirective,
    RouterLink],
  templateUrl: './layer-query.component.html',
  styleUrl: './layer-query.component.scss'
})
export class LayerQueryComponent {

  formData = {
    ward: '',
    roadName: '',
    location: '',
    ColumnName:'',
    tracingType: 'up'
  };

  ConditionList :any[] = ['!=','=', '<', '>', '<=', '>=', '<>', 'LIKE']

  currentPage: number = 0;
  totalPages: number = 0;
  PageSize : Number = 10

  ColumnName:any[]=[]

  layerList :any[] = []

  AllData : any[]=[]

  headers:any[]=[]

  wardExist : boolean = false
  RoadNameExist : boolean = false

  allward:any[]=[]
  RoadNameList : any[]=[]
  @ViewChild('QueryModal', { static: true }) drawingModal!: TemplateRef<any>;

  traceForm!: FormGroup;

  constructor(private excelService : ExportService,private modalService: NgbModal,private service : MapServiceService,private layerService : LayersApiService,private fb : FormBuilder){
    this.traceForm = new FormGroup({
      layer :new FormControl('', Validators.required)
      // ward: new FormControl('', Validators.required),
      // roadName: new FormControl('', Validators.required),
      // location: new FormControl('', Validators.required),
      // tracingType: new FormControl('up', Validators.required)
    });
  }


  ngOnInit():void{
    // this.openModal(this.drawingModal)
    this.getAllTable()
    this.getAllWard()
    const editControl = new LayerQuery(this.service.map,()=>{
      this.openModal(this.drawingModal)
    });
    this.service.map.addControl(editControl);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getAllRecord(false)
    }

  }

  getPagesToShow() {
    const visiblePages = [];
    const maxPagesToShow = 3;  // Number of pages to display around the current page

    const startPage = Math.max(2, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }

  checkWard(ward:any){
    console.log(ward)

    let checkExist = this.layerList.find((layer) => layer.TABLE_NAME === ward)


    this.totalPages = (checkExist.RowCount / 10)
    this.totalPages = Number(this.totalPages.toFixed(0))

    console.log(this.totalPages)
    
    if(checkExist.WardExists){
      this.traceForm.addControl('ward',this.fb.control('',Validators.required))
      this.wardExist = true
    }else{
      this.traceForm.removeControl('ward')
      this.wardExist = false
      
    }
    console.log(checkExist.RoadNameExists)
    if(checkExist.RoadNameExists){
      
      this.RoadNameExist = true
    }else{
      this.traceForm.removeControl('roadName')
      this.RoadNameExist = false
    }
    

  }



  openModal(modalContent: TemplateRef<any>) {
    this.modalService.open(modalContent);
  }


  

  onTrace() {
    if (this.traceForm.valid) {
      console.log(this.traceForm.value);
      this.getAllRecord(false)
    } else {

      console.log('Form is invalid',this.traceForm.value);
      
    }
  }

  onReset() {
    this.traceForm.reset();
    this.RoadNameExist = false
    this.wardExist = false
    this.headers = []
    this.AllData = []
  }

  getAllWard(){

    console.log("Layer Query");
    let req = {
      "flag":"getAllWard",
      "Spname":"spGetAllWards",
      "data":{
        Table:"WardMaster"
      }
    
  }
  this.layerService.dbQuery(req).subscribe(resp=>{
    this.allward = resp.data
  })

}

getAllTable(){

  console.log("Layer Query");
  let req = {
    "flag":"getAllTableName",
    "Spname":"spGetAllWards",
    "data":""
  
}
this.layerService.dbQuery(req).subscribe(resp=>{
  this.layerList = resp.data
})

}


getRoadname(id:any){

  console.log("Layer Query");
  let req = {
    "flag":"getRoadName",
    "Spname":"spGetAllWards",
    "data":{
      Table : "Layer_RouteMaster",
      wardId : id
    }
  
}
this.layerService.dbQuery(req).subscribe(resp=>{
  console.log(resp)
  const uniqueById = resp.data.filter(
    (value:any, index:any, self:any) => self.findIndex((obj:any) => obj.RoadName === value.RoadName) === index
  );
  
  console.log(uniqueById);
  this.RoadNameList = uniqueById

  if(uniqueById.length > 0){
    this.traceForm.addControl('roadName',this.fb.control('',Validators.required))
  }
})


}


getAllRecord(All :any){

  console.log("Layer Query");

  if(All){
    this.RoadNameExist = false
    this.wardExist = false
  }
  let dataType = ''
  if(isNaN(this.traceForm.get('ConditionName')?.value)){
    dataType = 'NVARCHAR'
  }else{
    dataType = 'INT'
  }

  let req = {
    "flag":"",
    "Spname":"GetDynamicData",
    "data":{
      TableName:this.traceForm.get('layer')?.value,
      WhereCondition : this.traceForm.get('ColumnName')?.value,
      ConditionValue : this.traceForm.get('ConditionName')?.value,
      Operator: this.traceForm.get('Condition')?.value,
      ConditionDataType:dataType,
      Offset : this.currentPage,
      PageSize : this.PageSize
    }
  
}


console.log(req)
this.layerService.dbQuery(req).subscribe(resp=>{
  console.log(resp)
  if(resp.data.length != 0){
    this.headers = Object.keys(resp.data[0])
    
  console.log(this.headers);
  
  this.AllData = resp.data
  this.totalPages = resp.data.length-1
  console.log("Updated AllData",this.AllData)
  }else{
    return alert("No Data Found")
  }
  
})

}


isObject(variable :any) {
  if(variable !== null && typeof variable === 'object'){
    return JSON.stringify(variable)
  }else{
    return variable
  }
}

export(){
  if(this.AllData.length == 0){
    return alert("No data")
  }

  this.excelService.exportAsExcelFile(this.AllData,'layerData')
}

getColumnsName(TableName:any){

  let checkExist = this.layerList.find((layer) => layer.TABLE_NAME === TableName)


    this.totalPages = (checkExist.RowCount / 10)
    this.totalPages = Number(this.totalPages.toFixed(0))

  let req = {
    "flag":"",
    "Spname":"GetColumnNames",
    "data":{
      TableName:TableName
    }
  
}




console.log(this.traceForm.value)
this.layerService.dbQuery(req).subscribe(resp=>{
  this.ColumnName = resp.data

  this.traceForm.addControl('ColumnName',this.fb.control('',Validators.required))
  this.traceForm.addControl('Condition',this.fb.control('',Validators.required))
  this.traceForm.addControl('ConditionName',this.fb.control('',Validators.required))

  console.log(resp)
})

}



}