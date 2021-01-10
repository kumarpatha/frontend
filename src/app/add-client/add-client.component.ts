import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
declare var $: any;

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.less']
})
export class AddClientComponent implements OnInit {
    clientForm: FormGroup;
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
        this.clientForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        description: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
}

// convenience getter for easy access to form fields
get f() { return this.clientForm.controls; }

onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.clientForm.invalid) {
        return;
    }

    this.loading = true;
    this.loadingData = true;
    this.userService.addClient(this.clientForm.value)
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
                this.router.navigate(['/clients']);
            },
            error => {
                this.error = error;
                this.loading = false;
                this.loadingData = false;

            });
}

}
