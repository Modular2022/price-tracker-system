import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreensComponent } from "./screens.component";


const routes: Routes = [
	{
		path: "modular",
		component: ScreensComponent,
    loadChildren: () => import("./child-routes.module").then( m => m.ChildRoutesModule )
	},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class ScreensRoutingModule {}