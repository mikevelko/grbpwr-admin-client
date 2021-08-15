import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddProductRequest } from '../models/products';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment';
 
@Injectable({providedIn:'root'})
export class ApiService {
 
  baseURL = environment.API_SERVER_URL ? environment.API_SERVER_URL :  "http://localhost:8081/"
 
  constructor(private http: HttpClient) {
  }
 
//   getProduct(): Observable<Person[]> {
//     console.log('getProduct '+this.baseURL + 'product')
//     return this.http.get<Person[]>(this.baseURL + 'product')
//   }
 
  public AddProduct(product:AddProductRequest): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(product);
    console.log(body)
    return this.http.post(this.baseURL + 'product', body,{'headers':headers})
  }
 
}