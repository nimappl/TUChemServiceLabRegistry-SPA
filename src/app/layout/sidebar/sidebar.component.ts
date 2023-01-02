import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private location: Location,
              private router: Router) {}

  ngOnInit(): void {}
}
