import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.less']
})
export class ProductCategoryComponent implements OnInit {

  loading = false;
  productCategory: FormGroup;
  loadingData = false;
  currentUser: User;
  categories:any;
  addcategory:any = false;
  submitted = false;
  returnUrl: string;
  error = '';
  info: string;
  constructor(private formBuilder: FormBuilder, private userService: UserService, private authenticationService: AuthenticationService, private router: Router,) {
    this.currentUser = this.authenticationService.currentUserValue;
   }

  ngOnInit() {
    this.loading = true;
        this.loadingData = true
        this.userService.getProductCategories().pipe(first()).subscribe(data => {
            this.loading = false;
            this.loadingData = false;
            this.categories = data.categories;
        });
        this.productCategory = this.formBuilder.group({
          category_name: [''],
          status: ['']
        });
  }
   // convenience getter for easy access to form fields
   get f() { return this.productCategory.controls; }

   onSubmit() {
       this.submitted = true;

       // stop here if form is invalid
       if (this.productCategory.invalid) {
           return;
       }

       this.loading = true;
       this.loadingData = true;
       this.userService.addProductCatgory(this.productCategory.value)
           .pipe(first())
           .subscribe(
               data => {
                   this.loading = false;
                   this.loadingData = false;
                   if(data.status == '1') {
                     Swal.fire('', data.message, 'success');
                     window.location.reload();
                   }
               },
               error => {
                   this.error = error;
                   this.loading = false;
                   this.loadingData = false;
               });
   }
  addCategory(){
    this.addcategory = true;
  }
}
