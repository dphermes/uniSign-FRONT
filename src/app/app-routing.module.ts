import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {UserManagementComponent} from "./user/user-management/user-management.component";
import {RegisterComponent} from "./register/register.component";
import {AuthGuard} from "./guard/auth.guard";
import {UserProfileComponent} from "./user/user-profile/user-profile.component";
import {SignatureManagementComponent} from "./signature/signature-management/signature-management.component";
import {SignatureBuilderComponent} from "./signature/signature-builder/signature-builder.component";
import {AgencyComponent} from "./agency/agency.component";
import {SignatureDetailsComponent} from "./signature/signature-details/signature-details.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'agencies', component: AgencyComponent},
  {path: 'user/management', component: UserManagementComponent, canActivate: [AuthGuard]},
  {path: 'user/profile/:username', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: 'user/profile', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: 'signature/management', component: SignatureManagementComponent, canActivate: [AuthGuard]},
  {path: 'signature/builder/:signatureVersionId', component: SignatureBuilderComponent, canActivate: [AuthGuard]},
  {path: 'signature/details/:signatureId', component: SignatureDetailsComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
