import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
declare var $: any;

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.less']
})
export class ViewProductComponent implements OnInit {
  currentUser: User;
  loading = false;
  loadingData = false;
  submitted = false;
  returnUrl: string;
  error = '';
  info: string;
  productInfo:any;
  status:any;
  editId:any;
  editimgUrl:any = '';
  categories:any;

constructor(
  private route: ActivatedRoute,
  private router: Router,
  private authenticationService: AuthenticationService,
  private userService: UserService
) { 
  this.currentUser = this.authenticationService.currentUserValue;
}

ngOnInit() {
      this.loadingData = true;
      this.loading = true;
      this.loadingData = true;
      this.editId = this.route.snapshot.paramMap.get('id');
      this.userService.getProductinfo(this.editId).pipe(first()).subscribe(data => {
          this.loading = false;
          this.loadingData = false;
          this.productInfo = data.product;
          if(this.productInfo.product_image != undefined){
            this.editimgUrl = data.image_base_path+'/'+this.productInfo.product_image;
          }
      });

      this.userService.getProductCategories().pipe(first()).subscribe(data => {
        this.loading = false;
        this.loadingData = false;
        this.categories = data.categories;
      });

      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

}
