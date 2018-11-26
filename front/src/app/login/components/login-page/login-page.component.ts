import {Component} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {CognitoUserAttribute, CognitoUserPool} from 'amazon-cognito-identity-js';
import {User} from './user';
import Amplify from 'aws-amplify';
import {Auth} from 'aws-amplify';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-login-page',
    templateUrl: 'login-page.component.html'
})
export class LoginPageComponent {
    user = new User();
    result = '';
    error = '';

    constructor() {
        const region = environment.region;
        const userPoolId = environment.userPoolId;
        const identityPoolId = environment.identityPoolId;
        const clientId = environment.clientId;

        Amplify.configure({
            Auth: {
                identityPoolId: identityPoolId,
                region: region,
                userPoolId: userPoolId,
                userPoolWebClientId: clientId,
                authenticationFlowType: 'USER_PASSWORD_AUTH'
            }
        });
    }

    register() {

    }

    login() {
        Auth.signIn(this.user.email, this.user.password)
            .then(
            (user) => {
                console.log(user);
                this.result = JSON.stringify(user, null, 2);
            })
            .catch((err) => {
                console.log(err);
                this.error = JSON.stringify(err);
            });
    }

    get diagnostic() {
        return JSON.stringify(this.user);
    }
}
