import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
declare var $: any;

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent {
    userForm: FormGroup;
    loading = false;
    loadingData = false;
    submitted = false;
    returnUrl: string;
    error = '';
    info: string;
    clients: any;

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
            console.log(data);
            this.clients = data.clients;
        });
        this.userForm = this.formBuilder.group({
            fullname: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            confirm_password: ['', Validators.required],
            client: ['', Validators.required],
            //language: ['', Validators.required]
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
        this.userService.register(this.userForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.loading = false;
                    this.loadingData = false;
                    if(data.status == '1') {
                        this.info = data.message;
                    } else {
                        this.error = data.message;
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