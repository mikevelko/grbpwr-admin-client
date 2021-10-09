import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AppComponent } from './app.component';
// import { NavbarComponent } from './components/navbar/navbar.component';
import { DataContentComponent } from './components/add-products/data-content.component';

// Services
import { DataService } from './services/data.service';
import { ProductComponent } from './components/edit-product/product.component';
import { HeaderComponent } from './components/header/header.component'
import { LoginComponent } from './components/login/login.component';

// Helpers
import { AuthGuard } from './helpers/auth.guard';


const AppRoutes: Routes = [
  {path: '', component:DataContentComponent, canActivate: [AuthGuard] },
  {path: 'product', component: ProductComponent, canActivate: [AuthGuard] },
  {path: 'login', component:LoginComponent},
]
 
@NgModule({
  declarations: [
    AppComponent,
    DataContentComponent,
    ProductComponent,
    LoginComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes)
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
