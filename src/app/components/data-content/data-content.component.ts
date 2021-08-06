import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {AddProductRequest ,AvailableSizes ,Price,Convert} from 'src/app/models/products';
// Services
import { DataService } from '../../services/data.service'

@Component({
  selector: 'app-data-content',
  templateUrl: './data-content.component.html',
  styleUrls: ['./data-content.component.scss']
})
export class DataContentComponent implements OnInit {

  sizes : AvailableSizes 
  price : Price
  requestBody: AddProductRequest 

  addProductForm: FormGroup;
  user:any;
  constructor(private fb: FormBuilder, private http: HttpClient) {
   this.addProductForm = fb.group({
      mainImage : ['', Validators.required],
      productImages: ['', Validators.required],
      name: ['', Validators.required],
      usd: ['', Validators.required],
      byn: ['', Validators.required],
      rub: ['', Validators.required],
      eur: ['', Validators.required],
      xxs: ['', Validators.required],
      xs: ['', Validators.required],
      s: ['', Validators.required],
      m: ['', Validators.required],
      l: ['', Validators.required],
      xl: ['', Validators.required],
      xxl: ['', Validators.required],
      os: ['', Validators.required],
      description: ['', Validators.required],
      categories: ['', Validators.required],
    });
    this.addProductForm.updateOn
  }


  ngOnInit() {
  }

 

  mainImage: string;
	selectFile(event: any) { 
		var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		
		reader.onload = (e: any) => {
			this.mainImage = e.target.result; 
      this.requestBody.mainImage = e.target.result
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
      this.requestBody.productImages = this.productImages
    }
  }


  resp: any
  OnSubmit(event: any): void {
    alert( JSON.stringify(Convert.ProductFormToAddProductRequest(this.addProductForm.value,this.productImages,this.mainImage)))

    // this.http.post<any>('http://localhost:8080/product', this.requestBody).subscribe(data => {
    //   this.resp= data.id;
    // })
  }
}
