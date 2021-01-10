import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
declare var $: any;


@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.less']
})
export class EditProjectComponent implements OnInit {

  projectForm: FormGroup;
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
  customers:any;
  filesmulti:string  []  =  [];
  status:any;
  editId:any;
  projectInfo:any;
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
        this.loadingData = true;
        this.status = 1;
        this.userService.getcustomers().pipe(first()).subscribe(data => {
          this.loading = false;
          this.loadingData = false;
          this.customers = data.customers;
      });
      this.projectForm = this.formBuilder.group({
        project_name: ['', Validators.required],
        customer: ['', Validators.required],
        description: ['', Validators.required],
        category: ['', Validators.required],
        building_part: ['', [Validators.required]],
        unit: ['', Validators.required],
        quantity: ['', Validators.required],
        length: ['', Validators.required],
        width: ['', Validators.required],
        height: ['', Validators.required],
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
  this.loading = true;
      this.loadingData = true;
      this.editId = this.route.snapshot.paramMap.get('id');
      this.userService.getProjectinfo(this.editId).pipe(first()).subscribe(data => {
          this.loading = false;
          this.loadingData = false;
          this.projectInfo = data.project;
          this.projectForm = this.formBuilder.group({
            project_name: this.projectInfo.project_name,
            customer: this.projectInfo.customer_id,
            description: this.projectInfo.description,
            category: this.projectInfo.category,
            building_part: this.projectInfo.building_part,
            unit: this.projectInfo.unit,
            quantity: this.projectInfo.quantity,
            length: this.projectInfo.length,
            width: this.projectInfo.width,
            height: this.projectInfo.height,
            production_year: this.projectInfo.production_year,
            location_building: this.projectInfo.location_building,
            brand_name: this.projectInfo.brand_name,
            documentation: this.projectInfo.documentation,
            product_info: this.projectInfo.product_info,
            color: this.projectInfo.color,
            hazardous: this.projectInfo.hazardous,
            evaluvation: this.projectInfo.evaluvation,
            precondition: this.projectInfo.precondition,
            reuse: this.projectInfo.reuse,
            recommendation: this.projectInfo.recommendation,
            price_new_product: this.projectInfo.price_new_product,
            status: this.projectInfo.status,
            price_used_product: this.projectInfo.price_used_product,
            price_sold_product: this.projectInfo.price_sold_product
          });
          this.editimgUrl = data.image_base_path+'/'+this.projectInfo.project_image;
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
get f() { return this.projectForm.controls; }

onSubmit() {
  this.submitted = true;

  // stop here if form is invalid
  if (this.projectForm.invalid) {
      return;
  }

  this.loading = true;
  this.loadingData = true;
  console.log(this.projectForm.value);
  console.log(JSON.stringify(this.projectForm.value));
  //this.formData.append('data', JSON.stringify(this.customerForm.value));
  console.log(this.filemultiUpload);
  var formData = new FormData();
  if(this.filesmulti.length > 0){
    for  (var i =  0; i <  this.filesmulti.length; i++)  {
      formData.append("imagemultiFile[]",  this.filesmulti[i]);
    }
  }
 
  if(this.fileToUpload){
      formData.set("imageFile", this.fileToUpload, this.fileToUpload.name);
  }
  formData.append("customer", this.projectForm.controls['customer'].value)
  formData.append("id", this.editId)
  formData.append("description", this.projectForm.controls['description'].value)
  formData.append("project_name", this.projectForm.controls['project_name'].value)
  formData.append("category", this.projectForm.controls['category'].value)
  formData.append("building_part", this.projectForm.controls['building_part'].value)
  formData.append("unit", this.projectForm.controls['unit'].value)
  formData.append("quantity", this.projectForm.controls['quantity'].value)
  formData.append("height", this.projectForm.controls['height'].value)
  formData.append("width", this.projectForm.controls['width'].value)
  formData.append("length", this.projectForm.controls['length'].value)
  formData.append("production_year", this.projectForm.controls['production_year'].value)
  formData.append("location_building", this.projectForm.controls['location_building'].value)
  formData.append("brand_name", this.projectForm.controls['brand_name'].value)
  formData.append("documentation", this.projectForm.controls['documentation'].value)
  formData.append("color", this.projectForm.controls['color'].value)
  formData.append("hazardous", this.projectForm.controls['hazardous'].value)
  formData.append("product_info", this.projectForm.controls['product_info'].value)
  formData.append("evaluvation", this.projectForm.controls['evaluvation'].value)
  formData.append("precondition", this.projectForm.controls['precondition'].value)
  formData.append("reuse", this.projectForm.controls['reuse'].value)
  formData.append("recommendation", this.projectForm.controls['recommendation'].value)
  formData.append("price_new_product", this.projectForm.controls['price_new_product'].value)
  formData.append("status", this.projectForm.controls['status'].value)
  formData.append("price_used_product", this.projectForm.controls['price_used_product'].value)
  formData.append("price_sold_product", this.projectForm.controls['price_sold_product'].value)

  console.log(formData);
  
  this.userService.editProject(formData)
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
              this.router.navigate(['/projects']);
          },
          error => {
              this.error = error;
              this.loading = false;
              this.loadingData = false;
          });
}

}
