import { NgModule } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  exports: [
    DropdownModule,
    CalendarModule
  ]
})
export class PrimeNgModule { }
