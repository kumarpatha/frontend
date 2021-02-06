import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
declare var $: any;


@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.less']
})
export class EditUsersComponent implements OnInit {

  userForm: FormGroup;
    loading = false;
    loadingData = false;
    submitted = false;
    returnUrl: string;
    error = '';
    info: string;
    clients: any;
    editId:any;
    user:any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) { 
        // // redirect to home if already logged in
        // if (this.authenticationService.currentUserValue) { 
        //     this.router.navigate(['/']);
        // }
    }

    ngOnInit() {
        this.loading = true;
        this.loadingData = true;
        this.userService.getclients().pipe(first()).subscribe(data => {
            this.loading = false;
            this.loadingData = false;
            this.clients = data.clients;
        });
        this.userForm = this.formBuilder.group({
          fullname: ['', Validators.required],
          email: ['', Validators.required],
          client: ['', Validators.required],
          password: [''],
          confirm_password: [''],
          //language: ['', Validators.required]
        });
        this.editId = this.route.snapshot.paramMap.get('id');
        this.userService.getuserinfo(this.editId).pipe(first()).subscribe(data => {
            this.loading = false;
            this.user = data.user;
            this.userForm.setValue({
              fullname: this.user.name,
              email: this.user.email,
              client: this.user.client_id,
              password: '',
              confirm_password: '',
              //language: this.user.language,
          });
        });
        
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.userForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.userForm.invalid) {
            return;
        }

        this.loading = true;
        this.loadingData = true;
        this.userService.editUser(this.userForm.value,this.editId)
            .pipe(first())
            .subscribe(
                data => {
                    this.loading = false;
                    this.loadingData = false;
                    if(data.status == '1') {
                      Swal.fire('', data.message, 'success');
                    } 
                    this.router.navigate(['']);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                    this.loadingData = false;
                });
    }

}
