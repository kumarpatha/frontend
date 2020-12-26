import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
declare var $: any;

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.less']
})
export class AddCustomerComponent implements OnInit {
    customerForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    info: string;
    public imagePath;
    imgURL: any = '';
    public message: string;
    fileToUpload: File = null;
    formData = new FormData();
 
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) { }

  ngOnInit() {
        this.customerForm = this.formBuilder.group({
          registerUsername: ['', Validators.required],
          orgname: ['', Validators.required],
          address: ['', Validators.required],
          postal_code: ['', [Validators.required,  Validators.pattern('[0-9]{6}')]],
          postal_area: ['', Validators.required],
          name: ['', Validators.required],
          mobile: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
          email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
          note: ['', Validators.required]
        
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
}

preview(files) {
  console.log(files);
  if (files.length === 0)
    return;

  var mimeType = files[0].type;
  if (mimeType.match(/image\/*/) == null) {
    this.message = "Only images are supported.";
    return;
  }

  var reader = new FileReader();
  this.fileToUpload = files[0];
  reader.readAsDataURL(files[0]); 
  reader.onload = (_event) => { 
    this.imgURL = reader.result; 
  }

}
// convenience getter for easy access to form fields
get f() { return this.customerForm.controls; }

onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.customerForm.invalid) {
        return;
    }

    this.loading = true;
    console.log(this.customerForm.value);
    console.log(JSON.stringify(this.customerForm.value));
    //this.formData.append('data', JSON.stringify(this.customerForm.value));
    console.log(this.fileToUpload);
    var formData = new FormData();
    formData.set("imageFile", this.fileToUpload, this.fileToUpload.name);
    formData.append("registerUsername", this.customerForm.controls['registerUsername'].value)
    formData.append("orgname", this.customerForm.controls['orgname'].value)
    formData.append("address", this.customerForm.controls['address'].value)
    formData.append("postal_code", this.customerForm.controls['postal_code'].value)
    formData.append("postal_area", this.customerForm.controls['postal_area'].value)
    formData.append("name", this.customerForm.controls['name'].value)
    formData.append("email", this.customerForm.controls['email'].value)
    formData.append("mobile", this.customerForm.controls['mobile'].value)
    formData.append("note", this.customerForm.controls['note'].value)
    
    console.log(formData);
    var options = { content: formData };
    
    this.userService.addCustomer(formData)
        .pipe(first())
        .subscribe(
            data => {
                this.loading = false;
                if(data.status == '1') {
                    this.info = data.message;
                } else {
                    this.error = data.message;
                }
                this.router.navigate(['/customers']);
            },
            error => {
                this.error = error;
                this.loading = false;
            });
}

}
