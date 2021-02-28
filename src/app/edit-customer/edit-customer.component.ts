import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
declare var $: any;

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.less']
})
export class EditCustomerComponent implements OnInit {

  customerForm: FormGroup;
  loading = false;
  loadingData = false;
  submitted = false;
  returnUrl: string;
  error = '';
  info: string;
  public imagePath;
  imgURL: any = '';
  public message: string;
  fileToUpload: File = null;
  formData = new FormData();
  editId:any;
  customerInfo:any;
  currentUser: User;
  editimgUrl:any = '';

constructor(
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  private router: Router,
  private authenticationService: AuthenticationService,
  private userService: UserService
) {
  this.currentUser = this.authenticationService.currentUserValue;
 }

ngOnInit() {
      this.customerForm = this.formBuilder.group({
        customerName: ['', Validators.required],
        orgname: ['', Validators.required],
        address: ['', Validators.required],
        postal_code: ['', [Validators.required,  Validators.pattern('[0-9]{6}')]],
        postal_area: ['', Validators.required],
        name: ['', Validators.required],
        mobile: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
        email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
        note: [''],
        country: ['', Validators.required]
      });

    this.loading = true;
    this.loadingData = true;
    this.editId = this.route.snapshot.paramMap.get('id');
    this.userService.getCustomerinfo(this.editId).pipe(first()).subscribe(data => {
        this.loading = false;
        this.loadingData = false;
        this.customerInfo = data.customer;
        this.customerForm = this.formBuilder.group({
          customerName: this.customerInfo.customer_name,
          orgname: this.customerInfo.org_number,
          address: this.customerInfo.address,
          postal_code: this.customerInfo.postal_code,
          postal_area: this.customerInfo.postal_area,
          name: this.customerInfo.name,
          mobile: this.customerInfo.mobile_number,
          email: this.customerInfo.email,
          note: this.customerInfo.note,
          country: this.customerInfo.country
        });
        if(this.customerInfo.image_path){
          this.editimgUrl = data.image_base_path+'/'+this.customerInfo.image_path;
        }
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

  if(this.customerForm.controls['country'].value == '2') {
    if(this.customerForm.controls['orgname'].value.length != '9'){
      alert("Org Number should be 9 digit for norway");
      return;
    }
    if(this.customerForm.controls['mobile'].value.length != '8'){
      alert("Mobile should be 8 digit for norway");
      return;
    }
  }

  this.loading = true;
  this.loadingData = true;
  console.log(this.customerForm.value);
  console.log(JSON.stringify(this.customerForm.value));
  //this.formData.append('data', JSON.stringify(this.customerForm.value));
  console.log(this.fileToUpload);
  var formData = new FormData();
  if(this.fileToUpload){
    formData.set("imageFile", this.fileToUpload, this.fileToUpload.name);
  }
  formData.append("orgname", this.customerForm.controls['orgname'].value)
  formData.append("id", this.editId)
  formData.append("address", this.customerForm.controls['address'].value)
  formData.append("customerName", this.customerForm.controls['customerName'].value)
  formData.append("postal_code", this.customerForm.controls['postal_code'].value)
  formData.append("postal_area", this.customerForm.controls['postal_area'].value)
  formData.append("name", this.customerForm.controls['name'].value)
  formData.append("country", this.customerForm.controls['country'].value)
  formData.append("email", this.customerForm.controls['email'].value)
  formData.append("mobile", this.customerForm.controls['mobile'].value)
  formData.append("note", this.customerForm.controls['note'].value)
  
  console.log(formData);
  var options = { content: formData };
  
  this.userService.editCustomer(formData)
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
              this.router.navigate(['/customers']);
          },
          error => {
              this.error = error;
              this.loading = false;
              this.loadingData = false;
          });
}

}
