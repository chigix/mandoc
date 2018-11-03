import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CustomIconRegistry } from './shared/custom-icon-registry';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule, // Used for request icon svg files by icon-registry
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
  ],
  providers: [
    { provide: MatIconRegistry, useClass: CustomIconRegistry }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
