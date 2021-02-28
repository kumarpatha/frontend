import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
declare var $: any;

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.less']
})
export class ViewProjectComponent implements OnInit {

  projectForm: FormGroup;
  currentUser: User;
  loading = false;
  loadingData = false;
  submitted = false;
  returnUrl: string;
  error = '';
  info: string;
  public imagePath;
  imgURL: any = '';
  public message: string;
  fileToUpload: File = null;
  filemultiUpload: File = null;
  formData = new FormData();
  customers:any;
  filesmulti:string  []  =  [];
  status:any;
  editId:any;
  projectInfo:any;
  editimgUrl:any = '';
  fdv_document:any;
  env_report:any;
  title = 'appBootstrap';
  filecat:string  []  =  [];
  filecattext:string  []  =  [];
  closeResult: string;
  doc_path:any;

  constructor( 
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService) {
      this.currentUser = this.authenticationService.currentUserValue;
     }

  ngOnInit() {
    $('.only_year').datetimepicker({
      format: "yyyy",
      startView: 'decade',
      minView: 'decade',
      viewSelect: 'decade',
      autoclose: true,
      pickerPosition: "bottom-left"
  });
  $('.fulldate').datetimepicker({
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0,
    pickerPosition: "bottom-left"
  });
  this.loadingData = true;
  this.status = 1;
  this.userService.getcustomers().pipe(first()).subscribe(data => {
    this.loading = false;
    this.loadingData = false;
    this.customers = data.customers;
  });
  this.projectForm = this.formBuilder.group({
    project_name: ['', Validators.required],
    customer: ['', Validators.required],
    project_address: [''],
    postal_code: [''],
    postal_area: [''],
    project_mang_name: [''],
    project_mang_mobile: [''],
    project_mang_email: [''],
    onsite_name: [''],
    onsite_mobile: [''],
    onsite_email: [''],
    project_type: [''],
    project_status: [''],
    property_area: [''],
    no_of_floors: [''],
    building_year: [''],
    last_refurbished: [''],
    env_report: [''],
    fdv_document: [''],
    ambition: [''],
    project_start_date: [''],
    project_catalog_date: [''],
    project_avail_date: [''], 
    project_avail_end_date: [''],
    note: [''],
    billing_project_company: [''],
    billing_orgno: [''],
    billing_project_number: [''],
    billing_customer_ref: [''],
    billing_address: [''],
    billing_postal_code: [''],
    billing_postal_area: [''],
    credit_period: [''] 
  });
  this.loading = true;
  this.loadingData = true;
  this.editId = this.route.snapshot.paramMap.get('id');
  this.userService.getProjectinfo(this.editId).pipe(first()).subscribe(data => {
    this.loading = false;
    this.loadingData = false;
    this.projectInfo = data.project;
    this.env_report = this.projectInfo.env_report,
    this.fdv_document = this.projectInfo.fdv_document,
    this.projectForm = this.formBuilder.group({
      project_name: this.projectInfo.project_name,
      customer: this.projectInfo.customer_id,
      project_address: this.projectInfo.project_address,
      postal_code: this.projectInfo.postal_code,
      postal_area: this.projectInfo.postal_area,
      project_mang_name: this.projectInfo.project_mang_name,
      project_mang_mobile: this.projectInfo.project_mang_mobile,
      project_mang_email: this.projectInfo.project_mang_email,
      onsite_name: this.projectInfo.onsite_name,
      onsite_mobile: this.projectInfo.onsite_mobile,
      onsite_email: this.projectInfo.onsite_email,
      project_type: this.projectInfo.project_type,
      project_status: this.projectInfo.project_status,
      property_area: this.projectInfo.property_area,
      no_of_floors: this.projectInfo.no_of_floors,
      building_year: this.projectInfo.building_year,
      last_refurbished: this.projectInfo.last_refurbished,
      env_report: this.projectInfo.env_report,
      fdv_document: this.projectInfo.fdv_document,
      ambition: this.projectInfo.ambition,
      project_start_date: this.projectInfo.project_start_date,
      project_catalog_date: this.projectInfo.project_catalog_date,
      project_avail_date: this.projectInfo.project_avail_date,
      project_avail_end_date: this.projectInfo.project_avail_end_date,
      note: this.projectInfo.note,
      billing_project_company: this.projectInfo.billing_project_company,
      billing_project_number: this.projectInfo.billing_project_number,
      billing_customer_ref: this.projectInfo.billing_customer_ref,
      billing_address: this.projectInfo.billing_address,
      billing_orgno: this.projectInfo.billing_orgno,
      billing_postal_code: this.projectInfo.billing_postal_code,
      billing_postal_area: this.projectInfo.billing_postal_area,
      credit_period: this.projectInfo.credit_period
    });
    if(this.projectInfo.project_image){
      this.editimgUrl = data.image_base_path+'/'+this.projectInfo.project_image;
    }
    this.doc_path = data.image_base_path;
  });
  }

}
