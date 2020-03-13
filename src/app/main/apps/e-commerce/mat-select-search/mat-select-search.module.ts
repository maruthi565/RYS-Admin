import { NgModule } from "@angular/core";
//import { MatSelectSearchComponent } from './mat-select-search.component';
import {
  MatButtonModule,
  MatInputModule,
  MatIconModule
} from "@angular/material";
import { CommonModule } from "@angular/common";
import { MatSelectSearchComponent } from "./mat-select-search.component";

@NgModule({
  imports: [CommonModule, MatButtonModule, MatIconModule, MatInputModule],
  declarations: [MatSelectSearchComponent],
  exports: [MatButtonModule, MatInputModule, MatSelectSearchComponent]
})
export class MatSelectSearchModule {}
