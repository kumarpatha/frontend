import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
declare var $: any;

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.less']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  currentUser: User;
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
  filemultiUpload: File = null;
  formData = new FormData();
  projects:any;
  filesmulti:string  []  =  [];
  status:any;

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
        this.loadingData = true;
        this.status = 1;
        this.userService.getprojects().pipe(first()).subscribe(data => {
          this.loading = false;
          this.loadingData = false;
          this.projects = data.projects;
      });
      this.productForm = this.formBuilder.group({
        product_name: ['', Validators.required],
        project_id: ['', Validators.required],
        description: ['', Validators.required],
        category: ['', Validators.required],
        building_part: ['', [Validators.required]],
        unit: ['', Validators.required],
        quantity: ['', Validators.required],
        length: ['', [Validators.required]],
        width: ['', [Validators.required]],
        height: ['', [Validators.required]],
        production_year: ['', [Validators.required]],
        location_building: ['', Validators.required],
        brand_name: ['', Validators.required],
        documentation: ['', Validators.required],
        product_info: ['', Validators.required],
        color: ['', Validators.required],
        hazardous: ['', Validators.required],
        evaluvation: ['', Validators.required],
        precondition: ['', Validators.required],
        reuse: ['', Validators.required],
        recommendation: ['', Validators.required],
        price_new_product: ['', Validators.required],
        status: ['', Validators.required],
        price_used_product: ['', Validators.required],
        price_sold_product: ['', Validators.required]
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

addfiles(files) {
  console.log(files);
  if (files.length === 0)
    return;
  var reader = new FileReader();
  for (let i = 0; i < files.length; i++) {
    this.filesmulti.push(files[i]);
  }
}
// convenience getter for easy access to form fields
get f() { return this.productForm.controls; }

onSubmit() 
{
  this.submitted = true;

  // stop here if form is invalid
  if (this.productForm.invalid) {
      return;
  }

  this.loading = true;
  this.loadingData = true;
  console.log(this.productForm.value);
  console.log(JSON.stringify(this.productForm.value));
  //this.formData.append('data', JSON.stringify(this.customerForm.value));
  console.log(this.filemultiUpload);
  var formData = new FormData();
  for  (var i =  0; i <  this.filesmulti.length; i++)  {
    formData.append("imagemultiFile[]",  this.filesmulti[i]);
  } 
  formData.set("imageFile", this.fileToUpload, this.fileToUpload.name);
  formData.append("project_id", this.productForm.controls['project_id'].value)
  formData.append("description", this.productForm.controls['description'].value)
  formData.append("product_name", this.productForm.controls['product_name'].value)
  formData.append("category", this.productForm.controls['category'].value)
  formData.append("building_part", this.productForm.controls['building_part'].value)
  formData.append("unit", this.productForm.controls['unit'].value)
  formData.append("quantity", this.productForm.controls['quantity'].value)
  formData.append("height", this.productForm.controls['height'].value)
  formData.append("width", this.productForm.controls['width'].value)
  formData.append("length", this.productForm.controls['length'].value)
  formData.append("production_year", this.productForm.controls['production_year'].value)
  formData.append("location_building", this.productForm.controls['location_building'].value)
  formData.append("brand_name", this.productForm.controls['brand_name'].value)
  formData.append("documentation", this.productForm.controls['documentation'].value)
  formData.append("color", this.productForm.controls['color'].value)
  formData.append("hazardous", this.productForm.controls['hazardous'].value)
  formData.append("product_info", this.productForm.controls['product_info'].value)
  formData.append("evaluvation", this.productForm.controls['evaluvation'].value)
  formData.append("precondition", this.productForm.controls['precondition'].value)
  formData.append("reuse", this.productForm.controls['reuse'].value)
  formData.append("recommendation", this.productForm.controls['recommendation'].value)
  formData.append("price_new_product", this.productForm.controls['price_new_product'].value)
  formData.append("status", this.productForm.controls['status'].value)
  formData.append("price_used_product", this.productForm.controls['price_used_product'].value)
  formData.append("price_sold_product", this.productForm.controls['price_sold_product'].value)

  console.log(formData);
  
  this.userService.addProduct(formData)
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
              this.router.navigate(['/products']);
          },
          error => {
              this.error = error;
              this.loading = false;
              this.loadingData = false;
          });
}

}
