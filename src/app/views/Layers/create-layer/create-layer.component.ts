import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { ButtonCloseDirective, ButtonModule, DropdownComponent, DropdownModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, TableDirective, ThemeDirective } from '@coreui/angular';
import { LayersApiService } from 'src/app/Services/layers-services/layers-api.service';

@Component({
  selector: 'app-create-layer',
  standalone: true,
  imports: [DropdownComponent,DropdownModule,ButtonModule,TableDirective,CommonModule,ReactiveFormsModule,FormsModule, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent],
  templateUrl: './create-layer.component.html',
  styleUrl: './create-layer.component.scss'
})
export class CreateLayerComponent {
  form: FormGroup;
  headers: any[] = []; // Initial headers
  TableName : string = ''
  LayerType : string = ''
  constructor(private fb: FormBuilder,private service:LayersApiService) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });
  }


  public visible = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  addRow(): void {
    const row = this.fb.group({});
    this.headers.forEach(header => {
      if(header.name == 'objectid'){
        row.addControl(header.name, this.fb.control(''));
      }else{
        row.addControl(header.name, this.fb.control('', Validators.required));
      }
      
    });
    this.rows.push(row);
  }

  // addColumn(columnName: string): void {
  //   if(columnName==''){
  //     return
  //   }
  //   this.headers.push(columnName);
  //   this.rows.controls.forEach(control => {
  //     const row = control as FormGroup; // Explicitly cast to FormGroup
  //     row.addControl(columnName, this.fb.control('', Validators.required));
  //   });
  // }

  addColumn(columnName: string, columnType: string) {
    if (columnName) {
      // Add the new column with its name and data type
      this.headers.push({ name: columnName, type: columnType });
  
      // Get the form array and explicitly cast it to a FormArray
      const rows = this.form.get('rows') as FormArray;
  
      // Check if rows is defined before using it
      if (rows) {
        rows.controls.forEach((control, index) => {
          // Check if control is a FormGroup
          if (control instanceof FormGroup) {
            if (columnType === 'int') {
              control.addControl(columnName, new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]));
            } else if (columnType === 'boolean') {
              control.addControl(columnName, new FormControl(false)); // boolean as a checkbox or true/false value
            } else {
              control.addControl(columnName, new FormControl('', Validators.required)); // varchar (string) by default
            }
          }
        });
      }

      if(this.headers.length == 1){
        // this.headers.unshift({ name: 'Id', type: 'int identity(1,1)' })
      }
    }
  }
  




  onSubmit(): void {
    
    if (this.form.valid) {
      let rows = this.form.value.rows
      let Result={
        rows,
        Fields : this.headers,
        TableName:this.TableName,
        LayerType:this.LayerType
      }
      console.log(Result);
      this.service.insertLayer(Result).subscribe(res=>{
        this.toggleLiveDemo()
        return alert("Success")
      })
      
    } else {
      // Handle form errors
      console.log(this.form.value);
      
      console.error('Form is invalid');
    }
  }

}
