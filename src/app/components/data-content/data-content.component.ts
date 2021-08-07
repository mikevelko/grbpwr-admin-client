import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AddProductRequest ,AvailableSizes ,Price,Convert} from 'src/app/models/products';
// Services
import { ApiService } from '../../services/api.service';

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
  constructor(private fb: FormBuilder, private apiService: ApiService) {
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

  addResponse: string = ""
  getRequestFromForm() {
    return Convert.ProductFormToAddProductRequest(this.addProductForm.value,this.productImages,this.mainImage)
  }
  validateAddProductRequest(prd :AddProductRequest) {
    if (prd.mainImage == "") {
      alert("set main image")
      return false
    }
    if (prd.productImages.length == 0) {
      alert("set product images")
      return false
    }
    if (prd.name.length == 0) {
      alert("set name")
      return false
    }
    if (prd.price.usd == 0 || prd.price.byn == 0 || prd.price.eur == 0 || prd.price.rub == 0 ) {
      alert("set correct prices for product")
      return false
    }
    if (prd.categories.length == 0) {
      alert("set categories")
      return false
    }
    if (prd.categories.length == 0) {
      alert("set categories")
      return false
    }
    return true

  }

  addProduct() {
    let prd = this.getRequestFromForm()
    if (this.validateAddProductRequest(prd)) {
      this.apiService.AddProduct(prd)
      .subscribe(data => {
        this.addResponse = JSON.stringify(data)
        console.log(data)
      })   
    }
  }


}
