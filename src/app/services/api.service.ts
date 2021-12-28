import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddProductRequest } from '../models/products';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment';
import { Products } from '../models/products'
import { AuthenticationService } from '../services/authentication.service'


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({providedIn:'root'})
export class ApiService {
  baseURL = environment.API_SERVER_URL ? environment.API_SERVER_URL :  "http://localhost:8081/"
 
  constructor(
    private http : HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  apiPrefix = "api/" 
  apiURL = this.baseURL + this.apiPrefix

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'Authorization': this.authenticationService.getTokenHeader()
  //   })
  // };

 
  getProduct(): Observable<Products[]> {
  console.log('getProduct '+this.apiURL + 'product')
  return this.http.get<Products[]>(this.apiURL + 'product')
  }

  modifyProductsById(id, size):Observable<Products[]> {
    return this.http.put<Products[]>(this.apiURL+'/product' + id, size,httpOptions)
  }
  deleteProductById(id:string):Observable<Products> {
    return this.http.delete<Products>(this.apiURL+'/product/'+id, httpOptions)
  }
 
  public AddProduct(product:AddProductRequest): Observable<any> {
    const headers = { 
      'Content-Type':  'application/json',
      'Authorization': this.authenticationService.getTokenHeader()
    }  
    const body=JSON.stringify(product);
    console.log(body)
    return this.http.post(this.baseURL + 'product', body,{'headers':headers})
  }
 
}