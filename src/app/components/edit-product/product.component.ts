import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service'
import { Products } from "../../models/products"

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.scss']
})
export class ProductComponent implements OnInit {
  public products: Products[];
  public search: string;
    
  constructor(private apiServer : ApiService) {
  }
  
  ngOnInit() {
    this.apiServer.getProduct().subscribe(res => {
        this.products = res;
    });
  }
}
