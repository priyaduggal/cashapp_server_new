import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditCardPage } from './edit-card.page';

const routes: Routes = [
  {
    path: '',
    component: EditCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditCardPageRoutingModule {}
