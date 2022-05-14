import { Component, OnInit } from "@angular/core";


export type NavbarItem = {
  label: string;
  route: string;
}

@Component({
	selector: "app-navbar",
	templateUrl: "./navbar.component.html",
	styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {

  items: NavbarItem[] = [
    { label: "Inicio", route: "/modular/home" },
    { label: "Buscador", route: "/modular/search" }
  ];

	constructor() {}

	ngOnInit(): void {}

}
