import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { BlogComponent } from './blog/blog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from './Services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { SuccessComponent } from './success/success.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatTableModule} from '@angular/material/table';
import { DriverdetailsComponent } from './driverdetails/driverdetails.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import { ReceivingComponent } from './receiving/receiving.component';
import { TransfersComponent } from './transfers/transfers.component';
import { OrdersComponent } from './orders/orders.component';
import { ShipmentDetailComponent } from './shipment-detail/shipment-detail.component';
import { TransferService } from './Services/transfer.service';
import { OrderService } from './Services/order.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RevTransferComponent } from './rev-transfer/rev-transfer.component';
import { RevOrderComponent } from './rev-order/rev-order.component';
import { BireportComponent } from './bireport/bireport.component';
import { BiSiderbarComponent } from './bi-siderbar/bi-siderbar.component';
import { BiHomeComponent } from './bi-home/bi-home.component';
import { TestRecvComponent } from './test-recv/test-recv.component';
import { ApploaderComponent } from './apploader/apploader.component';
import { RevReceivingComponent } from './rev-receiving/rev-receiving.component';
import { FinalizebuttonComponent } from './finalizebutton/finalizebutton.component';
import { ReviewbuttonComponent } from './reviewbutton/reviewbutton.component';
import { PrintbuttonComponent } from './printbutton/printbutton.component';
import { BackgroundpatternComponent } from './backgroundpattern/backgroundpattern.component';
import { ReceivingDetailsComponent } from './receiving-details/receiving-details.component';
import { FinalizeReceivingComponent } from './finalize-receiving/finalize-receiving.component';
import { UpdatedBtnComponent } from './updated-btn/updated-btn.component';
import { RevFinalizeComponent } from './rev-finalize/rev-finalize.component';
import { DownloadBtnComponent } from './download-btn/download-btn.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomePageComponent,
    AboutComponent,
    ContactComponent,
    BlogComponent,
    SuccessComponent,
    AppLayoutComponent,
    DriverdetailsComponent,
    ReceivingComponent,
    TransfersComponent,
    OrdersComponent,
    ShipmentDetailComponent,
    RevTransferComponent,
    RevOrderComponent,
    BireportComponent ,
    BiSiderbarComponent,
    BiHomeComponent,
    TestRecvComponent,
    ApploaderComponent,
    RevReceivingComponent,
    FinalizebuttonComponent,
    ReviewbuttonComponent,
    PrintbuttonComponent,
    BackgroundpatternComponent,
    ReceivingDetailsComponent,
    FinalizeReceivingComponent,
    UpdatedBtnComponent,
    RevFinalizeComponent,
    DownloadBtnComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule ,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    HttpClientModule,
    MatSelectModule,
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatRadioModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    SimpleNotificationsModule.forRoot(),
  ],
  providers: [ApiService,TransferService,OrderService],
  bootstrap: [AppComponent] 
})
export class AppModule { }
