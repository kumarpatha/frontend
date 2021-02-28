import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  currunt_user:any;
  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.currunt_user = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.currunt_user.rolr);
   
  }
   
  logout() {
    this.authenticationService.logout().pipe(first()).subscribe(data => {
      this.router.navigate(['/login']);
    });
  }

  toggleheader(){
    console.log("hdhhd");
    if($('#toggle-btn').hasClass('active')){
      $('#toggle-btn').removeClass('active')
    } else{
      $('#toggle-btn').addClass('active')
    }
    $('.side-navbar').toggleClass('shrinked');
    $('.content-inner').toggleClass('active');
      
      if ($(window).outerWidth() > 1183) {
          if ($('#toggle-btn').hasClass('active')) {
              $('.navbar-header .brand-small').hide();
              $('.navbar-header .brand-big').show();
          } else {
              $('.navbar-header .brand-small').show();
              $('.navbar-header .brand-big').hide();
          }
      }

       if ($(window).outerWidth() < 1183) {
           $('.navbar-header .brand-small').show();
      }
  }
}
