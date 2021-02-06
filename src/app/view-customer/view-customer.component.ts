import { Input } from '@angular/core';
import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.less']
})
export class ViewCustomerComponent implements OnInit {
  loading = false;
  loadingData = false;
  returnUrl: string;
  info: string;
  public imagePath;
  editId:any;
  customerDetails:any;
  currentUser: User;
  editimgUrl:any = '';

constructor(
  private route: ActivatedRoute,
  private router: Router,
  private authenticationService: AuthenticationService,
  private userService: UserService
) {
  this.currentUser = this.authenticationService.currentUserValue;
 }

ngOnInit() {
    this.loading = true;
    this.loadingData = true;
    this.editId = this.route.snapshot.paramMap.get('id');
    this.userService.getCustomerinfo(this.editId).pipe(first()).subscribe(data => {
        this.loading = false;
        this.loadingData = false;
        this.customerDetails = data.customer;
        if(this.customerDetails.image_path){
          this.editimgUrl = data.image_base_path+'/'+this.customerDetails.image_path;
        }
    });
  // get return url from route parameters or default to '/'
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
}

}
