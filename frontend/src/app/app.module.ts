import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from "./components/components.module";
import { PrimengModule } from "./primeng/primeng.module";
import { ScreensModule } from "./screens/screens.module";
import { InterceptorsService } from "./services/interceptors.service";
import { MessageService } from "primeng/api";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    PrimengModule,
    ComponentsModule,
    ScreensModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorsService, multi: true }, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
