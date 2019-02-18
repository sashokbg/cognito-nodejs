import {Component} from '@angular/core';
import {CognitoUserAttribute, CognitoUserPool} from 'amazon-cognito-identity-js';
import {User} from './user';
import Amplify, {Auth} from 'aws-amplify';
import {environment} from '../../../../environments/environment';
import {AuthInfo} from './authInfo';

@Component({
    selector: 'app-login-page',
    templateUrl: 'login-page.component.html'
})
export class LoginPageComponent {
    user = new User();
    authInfo = new AuthInfo();

    result = '';
    error = '';
    private loggedInUser;

    constructor() {
        this.authInfo.clientId = environment.clientId;
        // this.authInfo.identityPoolId = environment.identityPoolId;
        this.authInfo.region = environment.region;
        this.authInfo.userPoolId = environment.userPoolId;
    }

    register() {

    }

    changePassword() {
        console.log('Changing user password');
        Auth.completeNewPassword(this.loggedInUser, this.authInfo.password, null)
            .then(data => console.log(data))
            .catch(error => console.log(error));
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
                this.result = JSON.stringify(user.signInUserSession, null, 2);
            })
            .catch((err) => {
                console.log(err);
                this.error = JSON.stringify(err);
            });
    }

    get diagnostic() {
        return JSON.stringify(this.user);
    }

    get diagnosticAuth() {
        return JSON.stringify(this.authInfo);
    }
}
