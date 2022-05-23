import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from "./app.component";
import { ScreensRoutingModule } from "./screens/screens.routing";

const routes: Routes = [ 
  { path: "**", redirectTo: "modular" } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ScreensRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
