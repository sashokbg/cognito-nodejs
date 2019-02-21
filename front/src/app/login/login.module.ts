import {NgModule} from '@angular/core';
import {LoginPageComponent} from './components/login-page/login-page.component';
import {AuthService} from './services/auth.service';
import {AuthGuardService} from './services/auth-guard.service';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {FavoritesComponent} from './components/favorites/favorites.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    FavoritesComponent
  ],
  providers: [
    AuthGuardService, AuthService
  ],
  imports: [
    FormsModule, BrowserModule
  ]
})
export class LoginModule {

}

