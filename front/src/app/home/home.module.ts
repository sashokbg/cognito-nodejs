import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomePageComponent} from './home-page/home-page.component';
import {AuthGuardService} from '../login/services/auth-guard.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HomePageComponent
  ],
  providers: [
    AuthGuardService
  ]
})
export class HomeModule { }
