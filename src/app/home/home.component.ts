import { Component, ViewEncapsulation } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import Swal from 'sweetalert2';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    loadingData = false;
    users: any;

    constructor(private userService: UserService, private router: Router) { }

    ngOnInit() {
        this.loading = true;
        this.loadingData = true;
        this.userService.getAll().pipe(first()).subscribe(data => {
            this.loading = false;
            this.loadingData = false;
            this.users = data.users;
        });
    }

    deleteUser(client_id){
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
                this.loadingData = true;
                this.userService.deleteUser(client_id).pipe(first()).subscribe(data => {
                    this.loading = false;
                    this.loadingData = false;
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