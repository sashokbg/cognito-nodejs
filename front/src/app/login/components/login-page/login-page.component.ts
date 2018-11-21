import {Component} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {CognitoUserAttribute, CognitoUserPool} from 'amazon-cognito-identity-js';
import {User} from './user';
import Amplify from 'aws-amplify';
import {Auth} from 'aws-amplify';

@Component({
    selector: 'app-login-page',
    templateUrl: 'login-page.component.html'
})
export class LoginPageComponent {
    user = new User();

    constructor() {
        const region = 'eu-west-2';
        const userPoolId = `${region}_rmmxQMcc8`;
        const identityPoolId = `${region}:61ae2fab-c204-4578-83b3-c0973838c372`;
        const clientId = `3vm9u4heh4udklt7n0853q8fj9`;

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
            .then(user => console.log(user))
            .catch(err => console.log(err));
    }

    get diagnostic() {
        return JSON.stringify(this.user);
    }
}
