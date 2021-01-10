import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less']
})
export class ProductsComponent implements OnInit {

  loading = false;
  loadingData = false;
  products: any;
  listView: boolean = true;
  gridView: boolean = false;
  image_base_path:any = '';
  productInfo:any  = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
        this.loading = true;
        this.loadingData = true;
        this.userService.getproducts().pipe(first()).subscribe(data => {
            this.loading = false;
            this.loadingData = false;
            this.products = data.products;
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
    this.userService.searchProduct(value).pipe(first()).subscribe(data => {
        this.loading = false;
        this.loadingData = false;
        this.products = data.products;
        this.image_base_path = data.image_base_path;
    });
  }

  viewProduct(data){
      this.productInfo = data;
  }

  back(){
    this.productInfo = '';
    this.listView = true;
  }

  deleteProduct(product_id){
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
        this.userService.deleteProduct(product_id).pipe(first()).subscribe(data => {
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
