import { Component } from '@angular/core';
import { TableDirective } from '@coreui/angular';
import {LayersApiService} from '../../../Services/layers-services/layers-api.service'
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService ,ModalService} from 'src/app/Services/ModelToggle/modal.service';
import {LayerMasterComponent} from '../layer-master/layer-master.component'
@Component({
  selector: 'app-layer-list',
  standalone: true,
  imports: [TableDirective,CommonModule],
  templateUrl: './layer-list.component.html',
  styleUrl: './layer-list.component.scss'
})
export class LayerListComponent {

  allTable : any[] = []
  constructor(private ModelService  : ModalService,private service: LayersApiService,private router:Router,private DataService:DataService){}
    
  ngOnInit():void{
    // this.ModelService.toggleModal(true)
    this.service.getlayerstable().subscribe(res=>{
      console.log(res)
      this.allTable = res.data
    })

  }


  navigateWithParams(tableName:any) {
    // this.router.navigate(['/layer/edit'], {
    //   queryParams: { param1: tableName},
    // });

    this.DataService.changeValue(tableName)
    // this.masterLayer.setActiveTab('Edit')
    console.log(tableName)
  }
  
  navigatetoAddLayer() {
    this.router.navigate(['/layer/add'], {});
  }
}
