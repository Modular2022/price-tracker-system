import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from "./components/components.module";
import { PrimengModule } from "./primeng/primeng.module";
import { ScreensModule } from "./screens/screens.module";
import { InterceptorsService } from "./services/interceptors.service";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    PrimengModule,
    ComponentsModule,
    ScreensModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorsService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
