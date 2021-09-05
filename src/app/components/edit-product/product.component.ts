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

  constructor(private apiServer : ApiService, private dataServer : DataService) {
  }
  
  ngOnInit() {
    this.apiServer.getProduct().subscribe(res => {
      this.products = res;
    });
  }

  incremetn(item : Products, size) {
    this.apiServer.modifyProductsById(item, size + 1)
  }
  decrement(item : Products, size) {
    if (size > 0)
    this.apiServer.modifyProductsById(item, size - 1)
  }

}
