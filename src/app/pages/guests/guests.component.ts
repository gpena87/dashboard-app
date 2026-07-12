import { Component, ViewEncapsulation } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-guests',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './guests.component.html',
})
export class GuestsComponent {}
