import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { BlogComponent } from './blog/blog.component';
import { SuccessComponent } from './success/success.component';
import { DriverdetailsComponent } from './driverdetails/driverdetails.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { ReceivingComponent } from './receiving/receiving.component';
import { TransfersComponent } from './transfers/transfers.component';
import { ShipmentDetailComponent } from './shipment-detail/shipment-detail.component';
import { RevOrderComponent } from './rev-order/rev-order.component';
import { RevTransferComponent } from './rev-transfer/rev-transfer.component';
import { BireportComponent } from './bireport/bireport.component';
import { BiSiderbarComponent } from './bi-siderbar/bi-siderbar.component';
import { BiHomeComponent } from './bi-home/bi-home.component';
import { TestRecvComponent } from './test-recv/test-recv.component';
import { RevReceivingComponent } from './rev-receiving/rev-receiving.component';
import { ReceivingDetailsComponent } from './receiving-details/receiving-details.component';
import { FinalizeReceivingComponent } from './finalize-receiving/finalize-receiving.component';
import { RevFinalizeComponent } from './rev-finalize/rev-finalize.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'revrecv', component: RevReceivingComponent },
  {path: 'shipment-detail', component:ShipmentDetailComponent},
  {path: 'revorder', component:RevOrderComponent},
  {path:'rectransfer', component:RevTransferComponent},
  {path:'recvdetails', component:ReceivingDetailsComponent},
  {path: 'finalizerecv', component:FinalizeReceivingComponent},
  {path: 'revfinalize', component:RevFinalizeComponent},

  {
  path: '',
  component: AppLayoutComponent, // Shared layout for the following routes
  children: [
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'success', component: SuccessComponent },
    {path: 'Driverdetails',component:DriverdetailsComponent},
    {path: 'orders', component: OrdersComponent},
    {path: 'receivings', component: ReceivingComponent},
    {path: 'transfers',component:TransfersComponent},
    {path:'test', component:TestRecvComponent}

  ],
},
{
  path: '',
component: BiSiderbarComponent,
children:[
  {path:'report',component:BireportComponent},
  {path: 'home',component:BiHomeComponent},

],
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
