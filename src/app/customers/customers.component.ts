import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.less']
})
export class CustomersComponent implements OnInit {

  loading = false;
  customers: any;
  listView: boolean = true;
  gridView: boolean = false;
  image_base_path:any = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
        this.loading = true;
        this.userService.getcustomers().pipe(first()).subscribe(data => {
            this.loading = false;
            console.log(data);
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
    console.log(value);
    this.loading = true;
    this.userService.search(value).pipe(first()).subscribe(data => {
        this.loading = false;
        console.log(data);
        this.customers = data.customers;
        this.image_base_path = data.image_base_path;
    });
  }


}
