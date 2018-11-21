import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from '../home/home-page/home-page.component';
import {LoginPageComponent} from '../login/components/login-page/login-page.component';
import {AuthGuardService} from '../login/services/auth-guard.service';
import {LoginModule} from '../login/login.module';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), LoginModule],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule {

}
