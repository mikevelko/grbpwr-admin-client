import { Component, OnInit } from '@angular/core';
// Services
import { DataService } from '../../services/data.service'

@Component({
  selector: 'app-data-content',
  templateUrl: './data-content.component.html',
  styleUrls: ['./data-content.component.scss']
})
export class DataContentComponent implements OnInit {


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

  constructor(
    private dataService : DataService
  ) { }

  ngOnInit() {

    // Init
    this.newData = {
      key : '',
      value : ''
    }

    // Load existing data
    this.getAllData()

  }

  // Add data function
  addData() {
    console.log("Adding new data :",this.newData);
    // If null key
    if(this.newData.key==''){
      alert("Null key")
    }else{
      this.dataService.addProduct(this.newData).subscribe(
        response => {
          console.log("Write data response :",response);
          if(response!=null){
            if(response.body=="SUCCESSFUL"){
              alert("Write success")
            }
          }
        },error => {
          console.log("Error :",error.error);
          alert("Write falied")
        }
      )
    }
  }

  // Get all data function
  getAllData() {
    this.dataService.getAllProducts().subscribe(
      response => {
        console.log("Get all data response : ",response)
        if(response!=null){
          this.dataContent=JSON.parse(response.body)
        }
      },error => {
        console.log("Error : ",error.error)
      }
    )
  }

}
