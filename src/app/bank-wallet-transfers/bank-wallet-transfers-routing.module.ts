import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankWalletTransfersPage } from './bank-wallet-transfers.page';

const routes: Routes = [
  {
    path: '',
    component: BankWalletTransfersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankWalletTransfersPageRoutingModule {}
