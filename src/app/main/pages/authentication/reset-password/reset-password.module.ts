import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FuseSharedModule } from '@fuse/shared.module';

import { ResetPasswordComponent } from 'app/main/pages/authentication/reset-password/reset-password.component';
import { ResetPasswordService } from 'app/main/pages/authentication/reset-password/reset-password.service';

const routes = [
    {
        path     : 'auth/reset-password',
        component: ResetPasswordComponent,
        resolve: {
            data: ResetPasswordService
        }
    }
];

@NgModule({
    declarations: [
        ResetPasswordComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        FuseSharedModule
    ],
    providers: [ResetPasswordService]
})
export class ResetPasswordModule
{
}
