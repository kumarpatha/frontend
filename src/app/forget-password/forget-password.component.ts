import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
declare var $: any;

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.less']
})
export class ForgetPasswordComponent implements OnInit {
    forgetForm: FormGroup;
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
    this.forgetForm = this.formBuilder.group({
      registerUsername: ['', Validators.required]
  });

  // get return url from route parameters or default to '/'
  //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
get f() { return this.forgetForm.controls; }

onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgetForm.invalid) {
        return;
    }

    this.loading = true;
    this.loadingData = true;
    this.authenticationService.forgetPassword(this.forgetForm.value)
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
            });
}

 

}
