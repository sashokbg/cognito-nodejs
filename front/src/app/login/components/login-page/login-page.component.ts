import {Component, OnInit} from '@angular/core';
import {CognitoUserAttribute, CognitoUserPool} from 'amazon-cognito-identity-js';
import {User} from './user';
import Amplify, {Auth} from 'aws-amplify';
import {AuthInfo} from './authInfo';

const EMAIL = 'cognito-login-mail';
const REGION = 'cognito-region';
const USER_POOL = 'cognito-user-pool';
const IDENTITY_POOL = 'cognito-identity-pool';
const CLIENT_ID = 'cognito-client-id';
const AUTH_FLOW = 'cognito-auth-flow';

declare const gapi: any;

@Component({
    selector: 'app-login-page',
    templateUrl: 'login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
    user: User;
    authInfo: AuthInfo;

    result = '';
    error = '';
    private loggedInUser;

    ngOnInit(): void {
        this.user = new User();
        this.authInfo = new AuthInfo();

        this.user.email = localStorage.getItem(EMAIL) || '';
        this.authInfo.identityPoolId = localStorage.getItem(IDENTITY_POOL) || '';
        this.authInfo.userPoolId = localStorage.getItem(USER_POOL) || '';
        this.authInfo.region = localStorage.getItem(REGION) || '';
        this.authInfo.clientId = localStorage.getItem(CLIENT_ID) || '';

        this.authInfo.authenticationFlowType = localStorage.getItem(AUTH_FLOW) || '';
    }

    register() {

    }

    changePassword() {
        console.log('Change First Time Password');
        Auth.completeNewPassword(this.loggedInUser, this.authInfo.password, null)
            .then(data => console.log(data))
            .catch((error) => {
                console.log(error);
                this.error = JSON.stringify(error);
            });
    }

    login() {
        Amplify.configure({
            Auth: {
                // identityPoolId: this.authInfo.identityPoolId,
                region: this.authInfo.region,
                userPoolId: this.authInfo.userPoolId,
                userPoolWebClientId: this.authInfo.clientId,
                authenticationFlowType: this.authInfo.authenticationFlowType,
            }
        });

        Auth.signIn(this.user.email, this.user.password)
            .then(
                (user) => {
                    console.log(user);
                    this.loggedInUser = user;

                    if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                        this.error = 'This user needs to change their password. See field below.';
                    } else {
                        this.result = JSON.stringify(user.signInUserSession, null, 2);
                    }

                })
            .catch((err) => {
                console.log(err);
                this.error = JSON.stringify(err);
            });
    }
}
