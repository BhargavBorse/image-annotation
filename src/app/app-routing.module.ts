import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {XmlStructureComponent} from '../app/xml-structure/xml-structure.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'xml-structure', component: XmlStructureComponent }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
