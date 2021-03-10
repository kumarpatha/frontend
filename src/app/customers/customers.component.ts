import { Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.less']
})
export class CustomersComponent implements OnDestroy, OnInit {

  loading = false;
  loadingData = false;
  customers: any;
  listView: boolean = true;
  gridView: boolean = false;
  image_base_path:any = '';
  currentUser: User;
  customerInfo:any = '';
  products_count:any;
  dtOptions:any;

  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective;
  
  constructor(private userService: UserService, private authenticationService: AuthenticationService, private http: HttpClient, private route: ActivatedRoute) {
    this.currentUser = this.authenticationService.currentUserValue;
   }

  ngOnInit() {
        this.loading = true;
        this.loadingData = true;
        $('.dataTables_filter').hide();
        const that = this;
        this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 25,
          serverSide: true,
          processing: true,
          "scrollX": true,
          "dom": '<"top"lr>rt<"bottom"ip><"clear">',
          // Configure the buttons
        //   buttons: [{
        //     extend: 'pdfHtml5',
        //     text: 'PDF',
        //     exportOptions: {
        //         modifier: {
        //             page: 'current'
        //         }
        //     }
        // }, 'print'],
          ajax: (dataTablesParameters: any, callback) => {
            //console.log(this.projectobj);
            //dataTablesParameters.search.value = this.projectobj;
            that.http
              .post<DataTablesResponse>(
                `${environment.apiUrl}/customers`,
                 dataTablesParameters, {}
              ).subscribe(resp => {
                that.customers = resp.data;
                this.loading = false;
                this.loadingData = false;
                if(resp.data.length > 0) {
                  this.image_base_path = resp.data[0].image_base_path;
                }
                callback({
                  recordsTotal: resp.recordsTotal,
                  recordsFiltered: resp.recordsFiltered,
                  data: resp.data
                });
              });
          },
          columns: [{ data: 'DT_RowIndex', orderable:false, searchable:false }, { data: 'customer_name', name : 'customer_name' }, { data: 'projects_count', name : 'projects_count', searchable:false}, { name: 'products_count', data: 'products_count',  searchable:false }, { data: 'postal_area' }]
        };
        // this.userService.getcustomers().pipe(first()).subscribe(data => {
        //     this.loading = false;
        //     this.loadingData = false;
        //     this.customers = data.customers;
        //     this.image_base_path = data.image_base_path;
        // });
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
    //this.loading = true;
    //this.loadingData = true;
    this.listView = true;
    this.gridView= false;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(value);
      dtInstance.draw();
    });
    // this.userService.search(value).pipe(first()).subscribe(data => {
    //     this.loading = false;
    //     this.loadingData = false;
    //     this.customers = data.customers;
    //     this.image_base_path = data.image_base_path;
    // });
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

  ngOnDestroy(): void {}

}
