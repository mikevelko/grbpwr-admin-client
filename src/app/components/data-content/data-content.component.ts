import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup,  Validators } from '@angular/forms';
// Services
import { DataService } from '../../services/data.service'

@Component({
  selector: 'app-data-content',
  templateUrl: './data-content.component.html',
  styleUrls: ['./data-content.component.scss']
})
export class DataContentComponent implements OnInit {


  addProductForm: FormGroup;
  user:any;
   constructor(private fb: FormBuilder) {
   this.addProductForm = fb.group({
      mainImage : ['', Validators.required],
      productImages: ['', Validators.required],
      productName: ['', Validators.required],
      USD: ['', Validators.required],
      BYN: ['', Validators.required],
      RUB: ['', Validators.required],
      EUR: ['', Validators.required],
      xxs: ['', Validators.required],
      xs: ['', Validators.required],
      s: ['', Validators.required],
      m: ['', Validators.required],
      l: ['', Validators.required],
      xl: ['', Validators.required],
      xxl: ['', Validators.required],
      description: ['', Validators.required],
      categories: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  OnSubmit(values) {
  this.user = this.addProductForm.value;
  console.log(this.user);
  }


  mainImage: any;
	selectFile(event: any) { 
		var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		
		reader.onload = (_event) => {
			this.mainImage = reader.result; 
		}
	}

  productImages: string[] = [];
  selectFiles(event: any): void {
    let selectedFiles = event.target.files;
  
    this.productImages = [];
    if (selectedFiles && selectedFiles[0]) {
      const numberOfFiles = selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.productImages.push(e.target.result);
        };
        reader.readAsDataURL(selectedFiles[i]);
      }
    }
  }

  // Whole data
  dataContent : {
    key : string,
    value : string
  }
  // New data
  newData : {
    key : string,
    value : string
  }

}
