import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from "./components/components.module";
import { PrimengModule } from "./primeng/primeng/primeng.module";
import { ScreensModule } from "./screens/screens.module";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // PrimengModule,
    ComponentsModule,
    ScreensModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
