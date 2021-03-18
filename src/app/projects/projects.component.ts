import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less']
})
export class ProjectsComponent implements OnDestroy, OnInit {

  loading = false;
  loadingData = false;
  projects: any;
  projectslist: any;
  projectInfo:any;
  listView: boolean = false;
  gridView: boolean = true;
  image_base_path:any = '';
  dtOptions:any;
  pagenumber:any = 1;
  loadmoreflag:boolean = true;

  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective;

  constructor(private userService: UserService, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
        this.loading = true;
        this.loadingData = true;
        //if(this.listView) {
          $('.dataTables_filter').hide();
          const that = this;
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 50,
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
                  `${environment.apiUrl}/projects`,
                  dataTablesParameters, {}
                ).subscribe(resp => {
                  that.projects = resp.data;
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
            columns: [{ data: 'DT_RowIndex', orderable:false, searchable:false }, { data: 'project_name', name : 'project_name' }, { data: 'customer.customer_name', name : 'customer.customer_name'}, { name: 'postal_area', data: 'postal_area'}, { data: 'property_area' }, { data: 'building_year' }]
          };
        //} else {
          this.getgridData();
        //}
       
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

  viewProject(data){
    this.projectInfo = data;
  }

  back(){
    this.projectInfo = '';
    this.listView = true;
  }

  search(value){
    this.listView = true;
    this.gridView= false;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(value);
      dtInstance.draw();
    });
    // this.userService.searchProject(value).pipe(first()).subscribe(data => {
    //     this.loading = false;
    //     this.loadingData = false;
    //     this.projects = data.projects;
    //     this.image_base_path = data.image_base_path;
    // });
  }

  deleteProject(project_id){
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
        this.userService.deleteProject(project_id).pipe(first()).subscribe(data => {
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

  loadMore(){
    this.pagenumber++;
    this.getgridData();
  }
 
  getgridData(){
    this.userService.getprojectsgrid(this.pagenumber).pipe(first()).subscribe(data => {
      this.loading = false;
      this.loadingData = false;
      if(this.pagenumber=='1') {
        if(data.projects.length < 12) {
          this.loadmoreflag = false;
        }
        this.projectslist = data.projects;
        console.log(this.projectslist)
      } else {
        if(data.projects.length > 0){
          data.projects.forEach(element => {
            //console.log(element);
            this.projectslist.push(element);
          });
          if(data.projects.length < 12) {
            this.loadmoreflag = false;
          }
          //this.projectslist.push(data.projects);
          console.log(this.projectslist)
        }else{
          this.loadmoreflag = false;
        }
      }
     
      this.image_base_path = data.image_base_path;
    });
  }
}
