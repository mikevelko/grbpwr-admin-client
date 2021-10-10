import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service' 
import { DataService } from '../../services/data.service'
import { Products } from "../../models/products"

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.scss']
})
export class ProductComponent implements OnInit {
  public products: Products[];
  public search: string;
  confirmDelete : boolean = false;

  constructor(private apiServer : ApiService, private dataServer : DataService) {
  }
  
  ngOnInit() {
    this.apiServer.getProduct().subscribe(res => {
      this.products = res;
    });
  }

  setConfirmDelete() {
    this.confirmDelete = !this.confirmDelete
  }

  deleteProduct(id) {
    console.log(id)
    //раскомитить что бы удалить
    //this.dataServer.deleteProductById(id)
  }

  // //wip
  // incremetn(id, size) {
  //   this.apiServer.modifyProductsById(id, size + 1)
  // }
  // decrement(id : Products, size) {
  //   if (size > 0)
  //   this.apiServer.modifyProductsById(id, size - 1)
  // }

}
