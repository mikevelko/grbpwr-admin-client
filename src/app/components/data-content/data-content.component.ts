import { Component, OnInit } from '@angular/core';
// Services
import { DataService } from '../../services/data.service'

@Component({
  selector: 'app-data-content',
  templateUrl: './data-content.component.html',
  styleUrls: ['./data-content.component.scss']
})
export class DataContentComponent implements OnInit {


  url: any;
	msg = "";

	selectFile(event: any) { 
    
		var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		
		reader.onload = (_event) => {
			this.url = reader.result; 
		}
	}

  selectedFiles?: FileList;
  message: string[] = [];

  previews: string[] = [];

  selectFiles(event: any): void {
    this.message = [];
    this.selectedFiles = event.target.files;
  
    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previews.push(e.target.result);
        };
  
        reader.readAsDataURL(this.selectedFiles[i]);
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
