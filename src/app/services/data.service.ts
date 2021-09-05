import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIResponse } from '../models/APIResponse'
import { environment } from '../../../src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  serverURL = environment.API_SERVER_URL ? environment.API_SERVER_URL :  "http://localhost:8080"

  constructor(
    private http : HttpClient
  ) { }



  // getAllData():Observable<APIResponse> {
  //   return this.http.get<APIResponse>(this.serverURL+'/getAllData')
  // }

  // writeData(data:any):Observable<APIResponse> {
  //   return this.http.post<APIResponse>(this.serverURL+'/writeData',data,httpOptions)
  // }

  addProduct(data:any):Observable<APIResponse> {
    return this.http.post<APIResponse>(this.serverURL+'/product',data,httpOptions)
  }

  deleteProductById(id:string):Observable<APIResponse> {
    return this.http.delete<APIResponse>(this.serverURL+'/product/'+id,httpOptions)
  }

  getProductsById(id:string):Observable<APIResponse> {
    return this.http.get<APIResponse>(this.serverURL+'/product/'+id)
  }

  getAllProducts():Observable<APIResponse> {
    return this.http.get<APIResponse>(this.serverURL+'/product')
  }

  modifyProductsById(data:any):Observable<APIResponse> {
    return this.http.put<APIResponse>(this.serverURL+'/product',data,httpOptions)
  }

}
