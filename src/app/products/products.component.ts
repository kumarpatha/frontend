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
  status_filter =[];
  category_filter =[];
  product_category:any;
  product_category_count:any;
  status_types:any;
  term: string;
  filter_record;
  totalrecord;

  

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
            this.status_types = data.status_type
            this.product_category_count = data.product_category_count;
            this.product_category = data.product_category;
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
            if(this.projectobj){
              dataTablesParameters.project = this.projectobj;
            }
            if(this.project_filter.length > 0){
              dataTablesParameters.project_filter = this.project_filter;
            }
            if(this.customer_filter.length > 0){
              dataTablesParameters.customer_filter = this.customer_filter;
            }
            if(this.category_filter.length > 0){
              dataTablesParameters.category_filter = this.category_filter;
            }
            if(this.status_filter.length > 0){
              dataTablesParameters.status_filter = this.status_filter;
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
                  this.totalrecord = resp.data[0].total_count;
                  this.filter_record = resp.recordsFiltered;
                  this.image_base_path = resp.data[0].image_base_path;
                }
                callback({
                  recordsTotal: resp.recordsTotal,
                  recordsFiltered: resp.recordsFiltered,
                  data: resp.data
                });
              });
          },
          columns: [{ data: 'DT_RowIndex', orderable:false, searchable:false }, { data: 'product_id', name : 'product_id' }, { data: 'product_name', name : 'product_name'}, { data: 'category_name' }, { data: 'price_new_product' }, { data: 'quantity' }, { data: 'dimention'}, { data: 'description'}, { data: 'status'}]
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

  custmerSelect(event){
    
    if(event.target.checked){
        for(let i =0;i < this.customers.length;i++){
          this.customers[i].isChecked = 1;
          this.customer_filter.push(this.customers[i].id);
          console.log(this.customers[i].id);
          console.log(this.projects);
          if(this.projects[this.customers[i].id]){
            this.projects[this.customers[i].id].forEach(element => {
              this.filterProject.push(element);
            });
        }
        }
    } else {
        console.log('remove');
        for(let i =0;i < this.customers.length;i++){
          this.customers[i].isChecked = 0;
          this.filterProject = [];
          this.customer_filter = [];
        }
       
    }
  }

  projectSelect(event){
    if(event.target.checked){
      for(let i =0;i < this.filterProject.length;i++){
        this.filterProject[i].isChecked = 1;
        this.project_filter.push(this.filterProject[i].id);
      }
      
    } else {
      for(let i =0;i < this.filterProject.length;i++){
        this.filterProject[i].isChecked = 0;
        this.project_filter = [];
      }
    }
  }
  categorySelect(event){
    if(event.target.checked){
      for(let i =0;i < this.product_category.length;i++){
        this.product_category[i].isChecked = 1;
        this.category_filter.push(this.product_category.id);
      }
      
    } else {
      for(let i =0; i < this.product_category.length;i++){
        this.product_category[i].isChecked = 0;
      }
      this.category_filter = [];
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
  

  addStatus(event) {
    if(event.target.checked){
      this.status_filter.push(event.target.value);
    } else {
        this.status_filter = this.status_filter.filter(function(s) {
          return s !== event.target.value;
        });
    }
  }
  addCategory(event) {
    if(event.target.checked){
      this.category_filter.push(event.target.value);
    } else {
        this.category_filter = this.category_filter.filter(function(s) {
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
    this.status_filter = [];
    this.category_filter = [];
    for(let i =0;i < this.customers.length;i++){
      this.customers[i].isChecked = 0;
    }
    for(let i =0;i < this.filterProject.length;i++){
      this.filterProject[i].isChecked = 0;
    }
    for(let i =0;i < this.product_category.length;i++){
      this.product_category[i].isChecked = 0;
    }
    for(let i =0;i < this.status_types.length;i++){
      this.status_types[i].isChecked = 0;
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
