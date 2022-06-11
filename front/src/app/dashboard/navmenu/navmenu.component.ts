import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { roleGetter } from 'src/app/app.module';

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit {

  role = roleGetter();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('basket');
    this.router.navigate(['']);
  }

}
