import { Component, OnInit} from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.less']
})
export class CustomersComponent implements OnInit {

  loading = false;
  loadingData = false;
  customers: any;
  listView: boolean = true;
  gridView: boolean = false;
  image_base_path:any = '';
  currentUser: User;
  customerInfo:any = '';
  products_count:any;
  
  constructor(private userService: UserService, private authenticationService: AuthenticationService,) {
    this.currentUser = this.authenticationService.currentUserValue;
   }

  ngOnInit() {
        this.loading = true;
        this.loadingData = true;
        this.userService.getcustomers().pipe(first()).subscribe(data => {
            this.loading = false;
            this.loadingData = false;
            this.customers = data.customers;
            this.image_base_path = data.image_base_path;
        });
  }

  viewType(type){
    if(type == 'list'){
      this.listView = true;
      this.gridView= false;
    } else {
      this.listView = false;
      this.gridView= true;
    }
  }

  search(value){
    this.loading = true;
    this.loadingData = true;
    this.listView = true;
    this.userService.search(value).pipe(first()).subscribe(data => {
        this.loading = false;
        this.loadingData = false;
        this.customers = data.customers;
        this.image_base_path = data.image_base_path;
    });
  }

  viewCustomer(data){
    this.customerInfo = data;
  }

  back(){
    this.customerInfo = '';
    this.listView = true;
  }

  deleteCustomer(customer_id){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteCustomer(customer_id).pipe(first()).subscribe(data => {
          this.loading = false;
          if(data.status == '1') {
            Swal.fire('', data.message, 'success');
          } 
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
      }
    })
   
  }

}
