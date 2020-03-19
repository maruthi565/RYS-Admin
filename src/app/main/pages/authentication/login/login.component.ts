import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { LoginService } from 'app/main/pages/authentication/login/login.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder, private _loginService: LoginService, private _router: Router
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            EmailID: ['', [Validators.required, Validators.email]],
            Password: ['', Validators.required]
        });
        this.loginForm.patchValue({
            EmailID: 'naresh@gmail.com',
            Password: 'RYS@123!'
        });
    }

    authenticate() {

        this._loginService.authenticate(this.loginForm.value).then((data) => {

            // Trigger the subscription with new data
            console.log("login " + data);

            // Show the success message
            if (data.Status == 1) {
                let result = data;
               // let adminemail = this.loginForm.value;
               // localStorage.setItem("AdminEmail",JSON.stringify(adminemail));

                localStorage.setItem("AdminLoginDetails", JSON.stringify(result));
                localStorage.setItem("AdminUserID", result.AdminUserID);
                this._router.navigate(['apps/e-commerce/users']);
            }
            else
                alert(data.Message);
        });

    }
}
