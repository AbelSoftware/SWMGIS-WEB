import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
  TooltipDirective,
  TooltipModule, GridModule
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { OpenlayerMapComponent } from '../../views/openlayer-map/openlayer-map.component';
import { AdministratorModule } from '../../modules/administrator/administrator.module';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [TooltipModule,
    TooltipDirective,
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
    OpenlayerMapComponent, GridModule,AdministratorModule
  ]
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  username: any;
  lDetails: any;
  constructor(private router: Router) {
    this.lDetails =sessionStorage.getItem("loginDetails"); 
    const parsedDetails = JSON.parse(this.lDetails); // Parse the string into an object
    this.username = parsedDetails.Username; // Access the property  

  }
  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }
  logOut() {
    console.log("log out")
    localStorage.removeItem('loginDetails');
    this.router.navigate(['/login']);
  }
}
