import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectBankPage } from './select-bank.page';

const routes: Routes = [
  {
    path: '',
    component: SelectBankPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectBankPageRoutingModule {}
