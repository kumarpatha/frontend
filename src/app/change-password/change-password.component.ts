import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { User } from '@app/_models';

import { UserService, AuthenticationService } from '@app/_services';
declare var $: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  loading = false;
  loadingData = false;
  submitted = false;
  returnUrl: string;
  error = '';
  info: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) { }

  ngOnInit() {
      this.changePasswordForm = this.formBuilder.group({
        current_password: ['', Validators.required],
        password: ['', Validators.required],
        password_confirmation: ['', Validators.required]
    });
     // get return url from route parameters or default to '/'
     //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

// convenience getter for easy access to form fields
get f() { return this.changePasswordForm.controls; }

onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
        return;
    }

    this.loading = true;
    this.loadingData = true;
    this.authenticationService.change_password(this.changePasswordForm.value)
        .pipe(first())
        .subscribe(
            data => {
                this.loading = false;
                this.loadingData = false;
                if(data.status == '1') {
                  Swal.fire('', data.message, 'success');
                  this.authenticationService.logout().pipe(first()).subscribe(data => {
                    this.router.navigate(['/login']);
                  });
                }
            },
            error => {
                this.error = error;
                this.loading = false;
                this.loadingData = false;
            });
}


}
