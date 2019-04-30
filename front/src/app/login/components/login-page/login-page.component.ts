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
export class LoginPageComponent implements OnInit, AfterViewInit {
    user: User;
    authInfo: AuthInfo;

    result = '';
    error = '';
    private loggedInUser;


    public auth2: any;

    public googleInit() {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: '938317867953-2l66pbqk0jhmdjr5taqisjo14tisjn17.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                scope: 'profile email openid'
            });
            this.attachSignin(document.getElementById('googleBtn'));
        });
    }

    public attachSignin(element) {
        this.auth2.attachClickHandler(element, {},
            (googleUser) => {
                const profile = googleUser.getBasicProfile();
                console.log('Token || ' + googleUser.getAuthResponse().id_token);
                console.log('ID: ' + profile.getId());
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail());

                Amplify.configure({
                    Auth: {
                        region: this.authInfo.region,
                        identityPoolId: this.authInfo.identityPoolId
                    }
                });

                Auth.federatedSignIn(
                    'google',
                    {
                        token: googleUser.getAuthResponse().id_token,
                        expires_at: 3600 * 1000 + new Date().getTime() // the expiration timestamp
                    },
                    null
                ).then(cred => {
                    // If success, you will get the AWS credentials
                    console.log(cred);
                }).catch((error) => {
                    console.log('Error Federated Signin: ', error);
                });

            }, (error) => {
                alert(JSON.stringify(error, undefined, 2));
            });
    }

    ngAfterViewInit() {
        this.googleInit();
    }

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
