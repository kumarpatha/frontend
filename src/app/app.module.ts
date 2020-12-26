import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
// import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { appRoutingModule } from './app.routing';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';;
import { HeaderComponent } from './header/header.component'
;
import { FooterComponent } from './footer/footer.component'
;
import { LeftNavComponent } from './left-nav/left-nav.component'
;
import { AddClientComponent } from './add-client/add-client.component';;
import { ClientsComponent } from './clients/clients.component';;
import { ChangePasswordComponent } from './change-password/change-password.component'
;
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CustomersComponent } from './customers/customers.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { EditUsersComponent } from './edit-users/edit-users.component';;
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        appRoutingModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent
,
        HeaderComponent
,
        FooterComponent ,
        LeftNavComponent ,
        AddClientComponent ,
        ClientsComponent ,
        ChangePasswordComponent,
        AddCustomerComponent,
        CustomersComponent,
        ForgetPasswordComponent,
        ResetPasswordComponent,
        EditClientComponent,
        EditUsersComponent,
        UserProfileComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
       // fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }