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

@Component({
    selector: 'app-login-page',
    templateUrl: 'login-page.component.html'
})
export class LoginPageComponent implements OnInit {
    user: User;
    authInfo: AuthInfo;

    savedAuthAndUserInfos: any[];

    result = '';
    error = '';
    private loggedInUser;
    shortcuteLocalStoragePrefix = 'profile__';

    ngOnInit(): void {
        this.user = new User();
        this.authInfo = new AuthInfo();

        this.user.email = localStorage.getItem(EMAIL) || '';
        this.authInfo.identityPoolId = localStorage.getItem(IDENTITY_POOL) || '';
        this.authInfo.userPoolId = localStorage.getItem(USER_POOL) || '';
        this.authInfo.region = localStorage.getItem(REGION) || '';
        this.authInfo.clientId = localStorage.getItem(CLIENT_ID) || '';

        this.authInfo.authenticationFlowType = localStorage.getItem(AUTH_FLOW) || '';

        this.savedAuthAndUserInfos = this.findAuthDetailslist();
        console.log('this.savedAuthInfos', this.savedAuthAndUserInfos);
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

    saveAuthInfoInShortcut(): void {
      if (this.authInfo.shortcutName) {
        const { password, ...objectToSave } = {...this.authInfo, ...this.user}; // on copie tout dans objectToSave sauf password
        console.log('objectToSave', objectToSave);
        localStorage.setItem(`${this.shortcuteLocalStoragePrefix}${this.authInfo.shortcutName}`, JSON.stringify(objectToSave));
      }
    }

    changeAuthInfosFromShortcut(authAndUserInfo: any) {
      console.log('changeAuthInfosFromShortcut. authAndUserInfo', authAndUserInfo);

      this.authInfo.authenticationFlowType = authAndUserInfo.authenticationFlowType;
      this.authInfo.clientId = authAndUserInfo.clientId;
      this.authInfo.identityPoolId = authAndUserInfo.identityPoolId;
      this.authInfo.region = authAndUserInfo.region;
      this.authInfo.shortcutName = authAndUserInfo.shortcutName;
      this.authInfo.userPoolId = authAndUserInfo.userPoolId;
      this.user.email = authAndUserInfo.email;

    }

    get diagnostic() {
        return JSON.stringify(this.user);
    }

    get diagnosticAuth() {
        return JSON.stringify(this.authInfo);
    }

    saveMail($event) {
        localStorage.setItem(EMAIL, $event);
    }

    saveRegion($event: {}) {
        localStorage.setItem(REGION, $event.toString());
    }

    saveUserPool($event: {}) {
        localStorage.setItem(USER_POOL, $event.toString());
    }

    saveIdentityPool($event: {}) {
        localStorage.setItem(IDENTITY_POOL, $event.toString());
    }

    saveClientId($event: {}) {
        localStorage.setItem(CLIENT_ID, $event.toString());
    }

    saveAuthFlow($event: {}) {
      localStorage.setItem(AUTH_FLOW, $event.toString());
    }

    findAuthDetailslist(): any[] {
      return this.findLocalItems(this.shortcuteLocalStoragePrefix).map(
        (item) => item.val
      ) ;
    }

    findLocalItems (query: string): any[] {
      let i;
      const results = [];

      for (i in localStorage) {
        if (localStorage.hasOwnProperty(i)) {
          if (i.match(query) || (!query && typeof i === 'string')) {
            const value = JSON.parse(localStorage.getItem(i));
            results.push({key: i, val: value});
          }
        }
      }

      return results;
    }

    saveConfig() {
        this.saveAuthInfoInShortcut();
    }

    deleteConfig() {
        console.log('Deleting config', this.authInfo.shortcutName);
        localStorage.removeItem(`${this.shortcuteLocalStoragePrefix}${this.authInfo.shortcutName}`);
    }
}
