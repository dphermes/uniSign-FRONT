import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {UserManagementComponent} from "./user/user-management/user-management.component";
import {RegisterComponent} from "./register/register.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'user/management', component: UserManagementComponent},
  {path: 'register', component: RegisterComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
