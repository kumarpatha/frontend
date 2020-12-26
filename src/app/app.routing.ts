import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AddClientComponent } from './add-client/add-client.component';
import { ClientsComponent } from './clients/clients.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CustomersComponent } from './customers/customers.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { EditUsersComponent } from './edit-users/edit-users.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from './_helpers';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'user-register', component: RegisterComponent, canActivate: [AuthGuard]},
    { path: 'add-client', component: AddClientComponent, canActivate: [AuthGuard]},
    { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard]},
    { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]},
    { path: 'add-customer', component: AddCustomerComponent, canActivate: [AuthGuard]},
    { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard]},
    { path: 'forget-password', component: ForgetPasswordComponent},
    { path: 'reset-password/:id', component: ResetPasswordComponent},
    { path: 'edit-client/:id', component: EditClientComponent, canActivate: [AuthGuard]},
    { path: 'edit-user/:id', component: EditUsersComponent, canActivate: [AuthGuard]},
    { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard]},


  


    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);