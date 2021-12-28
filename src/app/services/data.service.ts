import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIResponse } from '../models/APIResponse'
import { environment } from '../../../src/environments/environment';
import { AuthenticationService } from '../services/authentication.service'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  baseURL = environment.API_SERVER_URL ? environment.API_SERVER_URL :  "http://localhost:8080"

  constructor(
    private http : HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      // 'Authorization': this.authenticationService.getTokenHeader
    })
  };

  apiPrefix = "api/" 
  apiURL = this.baseURL + this.apiPrefix

  // getAllData():Observable<APIResponse> {
  //   return this.http.get<APIResponse>(this.apiURL+'/getAllData')
  // }

  // writeData(data:any):Observable<APIResponse> {
  //   return this.http.post<APIResponse>(this.apiURL+'/writeData',data,httpOptions)
  // }

  // addProduct(data:any):Observable<APIResponse> {
  //   return this.http.post<APIResponse>(this.apiURL+'/product',data,httpOptions)
  // }

  // deleteProductById(id:string):Observable<APIResponse> {
  //   return this.http.delete<APIResponse>(this.apiURL+'/product/'+id,httpOptions)
  // }

  getProductsById(id:string):Observable<APIResponse> {
    return this.http.get<APIResponse>(this.apiURL+'/product/'+id)
  }

  getAllProducts():Observable<APIResponse> {
    return this.http.get<APIResponse>(this.apiURL+'/product')
  }

  // modifyProductsById(data:any):Observable<APIResponse> {
  //   return this.http.put<APIResponse>(this.apiURL+'/product',data,httpOptions)
  // }

}
