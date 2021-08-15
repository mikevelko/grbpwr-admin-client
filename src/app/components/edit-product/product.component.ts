import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIResponse } from '../../models/APIResponse'
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.scss']
})
export class ProductComponent implements OnInit {


  constructor() {

  }
  

  ngOnInit() {

  }

}

