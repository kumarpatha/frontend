import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-category',
  templateUrl: './project-category.component.html',
  styleUrls: ['./project-category.component.less']
})
export class ProjectCategoryComponent implements OnInit {

  loading = false;
  projectCategory: FormGroup;
  loadingData = false;
  currentUser: User;
  categories:any;
  addcategory:any = false;
  submitted = false;
  returnUrl: string;
  error = '';
  info: string;
  constructor(private formBuilder: FormBuilder, private userService: UserService, private authenticationService: AuthenticationService) {
    this.currentUser = this.authenticationService.currentUserValue;
   }

  ngOnInit() {
    this.loading = true;
        this.loadingData = true;
        this.userService.getProjectCategories().pipe(first()).subscribe(data => {
            this.loading = false;
            this.loadingData = false;
            this.categories = data.categories;
        });
        this.projectCategory = this.formBuilder.group({
          category_name: [''],
          status: ['']
        });
  }
   // convenience getter for easy access to form fields
   get f() { return this.projectCategory.controls; }

   onSubmit() {
       this.submitted = true;

       // stop here if form is invalid
       if (this.projectCategory.invalid) {
           return;
       }

       this.loading = true;
       this.loadingData = true;
       this.userService.addProjectCatgory(this.projectCategory.value)
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
