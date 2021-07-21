import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BankWalletTransfersPageRoutingModule } from './bank-wallet-transfers-routing.module';

import { BankWalletTransfersPage } from './bank-wallet-transfers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BankWalletTransfersPageRoutingModule
  ],
  declarations: [BankWalletTransfersPage]
})
export class BankWalletTransfersPageModule {}
