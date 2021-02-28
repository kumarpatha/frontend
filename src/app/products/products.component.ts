import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import * as $ from 'jquery';


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less']
})
export class ProductsComponent implements OnDestroy , OnInit {

  //dtOptions: DataTables.Settings = {};
  loading = false;
  loadingData = false;
  products: any;
  listView: boolean = true;
  gridView: boolean = false;
  image_base_path:any = '';
  productInfo:any  = '';
  dtOptions:any;
  projectobj:any;
  filterData:any;
  project_count:any;
  projects:any;
  customers:any;
  customer_count:any;
  filterProject = [];
  finalProject = [];
  customer_filter =[];
  project_filter =[];
  term: string;

  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective;

  constructor(private userService: UserService, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
        this.loading = true;
        this.loadingData = true;
        this.userService.getFilterData().pipe(first()).subscribe(data => {
            this.loading = false;
            this.loadingData = false;
            this.customer_count = data.customer_count;
            this.customers = data.customers;
            this.project_count = data.project_count;
            this.projects = data.projects;
            //this.image_base_path = data.image_base_path;
        });
        this.projectobj = this.route.snapshot.queryParams['param_id'];
        $('.dataTables_filter').hide();
        const that = this;
        this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 25,
          serverSide: true,
          processing: true,
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
            if(this.projectobj){
              dataTablesParameters.project = this.projectobj;
            }
            if(this.project_filter.length > 0){
              dataTablesParameters.project_filter = this.project_filter;
            }
            if(this.customer_filter.length > 0){
              dataTablesParameters.customer_filter = this.customer_filter;
            }
            that.http
              .post<DataTablesResponse>(
                `${environment.apiUrl}/products`,
                 dataTablesParameters, {}
              ).subscribe(resp => {
                that.products = resp.data;
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
          columns: [{ data: 'DT_RowIndex', orderable:false, searchable:false }, { data: 'product_id', name : 'product_id' }, { data: 'product_name', name : 'product_name'}, { data: 'category.category_name' }, { data: 'price_new_product' }, { data: 'quantity' }, { data: 'dimention'}, { data: 'description'}, { data: 'status'}]
        };
       
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
    this.listView = true;
    this.gridView= false;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(value);
      dtInstance.draw();
    });
    // this.userService.searchProduct(value).pipe(first()).subscribe(data => {
    //     this.loading = false;
    //     this.loadingData = false;
    //     this.products = data.products;
    //     this.image_base_path = data.image_base_path;
    // });
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

  ngOnDestroy(): void {
    // We remove the last function in the global ext search array so we do not add the fn each time the component is drawn
    // /!\ This is not the ideal solution as other components may add other search function in this array, so be careful when
    // handling this global variable
   // $.fn['dataTable'].ext.search.pop();
  }

  filter(){
    var $slider = $('.mydiv');
        $slider.animate({
          right: parseInt($slider.css('right'),0) == -250 ?
           0 : -250
        });
  }

  closeFilter(){
    var $slider = $('.mydiv');
        $slider.animate({
          right: parseInt($slider.css('right'),0) == 0 ?
           -250 : 0
        });
  }

  showProject(event){
    
    if(event.target.checked){
        console.log('add');
         //console.log(this.projects);
         //console.log(this.projects[event.target.value]);
         this.projects[event.target.value].forEach(element => {
           //console.log(element);
           this.filterProject.push(element);
         });
         this.customer_filter.push(event.target.value);
         console.log(this.filterProject);
    } else {
        console.log('remove');
        console.log(event.target.value);
        this.filterProject = this.filterProject.filter(function(eachdata) {
            return eachdata.customer_id != event.target.value;
        });
        this.customer_filter = this.customer_filter.filter(function(s) {
          return s != event.target.value;
        });
        console.log(this.filterProject);
    }
  }

  addProject(event){
      if(event.target.checked){
        this.project_filter.push(event.target.value);
      } else {
          this.project_filter = this.project_filter.filter(function(s) {
            return s !== event.target.value;
          });
      }
  }

  applyFilter(){
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      //dtInstance.search(value);
      dtInstance.draw();
    });
  }

  resetFilter(){
    this.customer_filter = [];
    this.project_filter = [];
    for(let i =0;i < this.customers.length;i++){
      this.customers[i].isChecked = 0;
    }
    for(let i =0;i < this.filterProject.length;i++){
      this.filterProject[i].isChecked = 0;
    }
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      //dtInstance.search(value);
      dtInstance.draw();
    });
  }


  pdf() {
    this.userService.getpdfData().pipe(first()).subscribe(data => {
     
      //this.image_base_path = data.image_base_path;
  });
  }

}
