import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTableModule } from '@angular/material/table'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { NgModule } from '@angular/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
const modules = [
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatToolbarModule,
  MatTableModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatSnackBarModule,
  MatInputModule,
  MatProgressSpinnerModule
]

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules
})
export class MaterialModule {}
