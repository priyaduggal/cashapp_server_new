import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestAmountPageRoutingModule } from './request-amount-routing.module';

import { RequestAmountPage } from './request-amount.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestAmountPageRoutingModule
  ],
  declarations: [RequestAmountPage]
})
export class RequestAmountPageModule {}
