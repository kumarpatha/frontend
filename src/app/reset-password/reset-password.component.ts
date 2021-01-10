import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { User } from '@app/_models';

import { UserService, AuthenticationService } from '@app/_services';
import { analyzeAndValidateNgModules } from '@angular/compiler';
declare var $: any;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  loading = false;
  loadingData = false;
  submitted = false;
  returnUrl: string;
  error = '';
  info: string;
  token = '';
constructor(
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  private router: Router,
  private authenticationService: AuthenticationService,
  private userService: UserService
) { }

ngOnInit() {
  this.resetForm = this.formBuilder.group({
    password: ['', Validators.required],
   // token: ['', Validators.required],
    password_confirmation: ['', Validators.required]
});

// get return url from route parameters or default to '/'
//this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  console.log(this.route.snapshot.paramMap.get('id'));
  this.token = this.route.snapshot.paramMap.get('id');
}

// convenience getter for easy access to form fields
get f() { return this.resetForm.controls; }

onSubmit() {
  this.submitted = true;

  // stop here if form is invalid
  if (this.resetForm.invalid) {
      return;
  }

  this.loading = true;
  this.loadingData = true;
  this.authenticationService.resetPassword(this.resetForm.value, this.token)
      .pipe(first())
      .subscribe(
          data => {
              this.loading = false;
              this.loadingData = false;
              if(data.status == '1') {
                Swal.fire('', data.message, 'success');
              }
          },
          error => {
              this.error = error;
              this.loading = false;
              this.loadingData = false;
          });
}


}
