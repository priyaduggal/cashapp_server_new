import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AmountTransferPageRoutingModule } from './amount-transfer-routing.module';

import { AmountTransferPage } from './amount-transfer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmountTransferPageRoutingModule
  ],
  declarations: [AmountTransferPage]
})
export class AmountTransferPageModule {}
