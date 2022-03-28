import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { FabricjsEditorModule } from 'projects/angular-editor-fabric-js/src/public-api';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppRoutingModule } from './app-routing.module';
import { XmlStructureComponent } from './xml-structure/xml-structure.component';
import { HomeComponent } from './home/home.component';


const appRoutes: Routes = [
  { path: '', component: AppComponent },
  { path: 'xml-structure', component: XmlStructureComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '' }
  ];


@NgModule({
  declarations: [
    AppComponent,
    XmlStructureComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    FabricjsEditorModule,
    FormsModule,
    ColorPickerModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
