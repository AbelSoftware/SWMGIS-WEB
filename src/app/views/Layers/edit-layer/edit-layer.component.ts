import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { LayersApiService } from 'src/app/Services/layers-services/layers-api.service';
import { DataService } from 'src/app/Services/ModelToggle/modal.service';

import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-layer',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './edit-layer.component.html',
  styleUrl: './edit-layer.component.scss'
})
export class EditLayerComponent {

  form: FormGroup;
  headers:string[] = []
  param1 : any = ''
  initialRowsValues: any[] = [];

  constructor(private fb: FormBuilder,private service : LayersApiService,private route: ActivatedRoute,private DataService : DataService) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });
  }

  ngOnInit():void{

    this.route.queryParams.subscribe(params => {
      this.param1 = params['param1'];
      
    });
    if(this.param1 == '' || this.param1==undefined){
      this.DataService.currentValue.subscribe((visible:any) => {
        console.log(visible)
        if(visible){
          this.param1 = visible
        }
        
      });
    }
    console.log(this.param1)


    this.service.getSpecificlayerstable(this.param1).subscribe(res=>{
      console.log(res.data)
      res = res.data
      for(let i in res[0]){
        if(i != 'geom'){
          this.headers.push(i)
        }
        
      }

      console.log(this.headers)
      for(let i of res){
        let row = this.fb.group({})
        for(let j in i){
          if(j == 'geom'){
            // row.addControl(j,this.fb.control(i[j]))
          }else{
            row.addControl(j,this.fb.control(i[j],Validators.required))
          }
          
          
        }
        this.rows.push(row);
      }
      console.log(this.rows)
      this.storeInitialValues()
      this.trackChanges();
      

      
    })


    
  }

  storeInitialValues() {
    this.initialRowsValues = this.rows.controls.map(control => control.value);
    console.log(this.initialRowsValues)
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  addRow(): void {
    // const row = this.fb.group({
    //   name: ['', Validators.required],
    //   age: ['', [Validators.required, Validators.min(1)]],
    //   email: ['', [Validators.required, Validators.email]],
    // });
    let row = this.fb.group({})

    for(let i of this.headers){
      if(i == "Id" || i == 'geom'){
        row.addControl(i,this.fb.control(''))
      }else{
        row.addControl(i,this.fb.control('',Validators.required))
      }
      
    }
    
    this.rows.push(row);
  }
  
  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);

      const modifiedRows = this.getModifiedRows();

      let records = modifiedRows.map(x=>{
        return x.value
      })

      let Data = {
        data:records,
        TableName:this.param1
      }

      this.service.updatetLayer(Data).subscribe(response=>{
        console.log(response)

        return alert("Success")
      })
      console.log('Modified rows:', Data);
      // Handle form submission
    } else {
      this.form.markAllAsTouched(); // Mark all fields as touched for validation
    }
  }


  trackChanges() {
    this.rows.controls.forEach((control, index) => {
      control.valueChanges.subscribe((currentValue) => {
        if (JSON.stringify(currentValue) !== JSON.stringify(this.initialRowsValues[index])) {
          console.log(`Row ${index + 1} has been modified.`);
        }
      });
    });
  }

  getModifiedRows() {
    return this.rows.controls.filter((control, index) => 
      JSON.stringify(control.value) !== JSON.stringify(this.initialRowsValues[index])
    );
  }


}
