import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EKycPageRoutingModule } from './e-kyc-routing.module';

import { EKycPage } from './e-kyc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EKycPageRoutingModule
  ],
  declarations: [EKycPage]
})
export class EKycPageModule {}
