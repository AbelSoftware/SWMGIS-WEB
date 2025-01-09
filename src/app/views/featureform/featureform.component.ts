import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule, FormModule } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { LayersApiService } from '../../Services/layers-services/layers-api.service';

@Component({
  selector: 'app-featureform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, FormModule, FormsModule],
  templateUrl: './featureform.component.html',
  styleUrl: './featureform.component.scss'
})
export class FeatureformComponent implements OnInit {
  featureForm!: FormGroup;
  featureData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FeatureformComponent>,
    private fb: FormBuilder, private service: LayersApiService,
  ) {
    this.featureData = data;
    this.service.getLayesSchema(this.featureData.layerName).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
      }
    )


  }

  ngOnInit(): void {
    this.initializeForm();
    // console.log(this.featureData)

  }

  initializeForm(): void {
    const controls: { [key: string]: FormControl } = {};

    // Dynamically create form controls based on feature properties
    for (const [key, value] of Object.entries(this.featureData.featureProperties)) {
      controls[key] = new FormControl(value); // Use the value as the default
    }

    this.featureForm = this.fb.group(controls);
  }

  saveForm(): void {
    console.log('Updated Feature Data:', this.featureForm.value);
    this.dialogRef.close(this.featureForm.value); // Return updated data to the caller
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  closeForm(){
    this.dialogRef.close();
  }
}
