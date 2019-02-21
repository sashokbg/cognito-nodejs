import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.components.scss']
})
export class FavoritesComponent implements OnInit {

  @Input()
  authInfo: any;
  @Input()
  user: any;
  savedAuthAndUserInfos: any[];

  private shortcuteLocalStoragePrefix = 'profile__';

  ngOnInit(): void {
    this.savedAuthAndUserInfos = this.findAuthDetailslist();
    console.log('this.savedAuthInfos', this.savedAuthAndUserInfos);
  }

  deleteConfig() {
    console.log('Deleting config', this.authInfo.shortcutName);
    localStorage.removeItem(`${this.shortcuteLocalStoragePrefix}${this.authInfo.shortcutName}`);
    this.savedAuthAndUserInfos = this.findAuthDetailslist();
  }

  saveAuthInfoInShortcut(): void {
    if (this.authInfo.shortcutName) {
      const {...objectToSave } = {...this.authInfo, ...this.user}; // on copie tout dans objectToSave sauf password
      delete objectToSave.password;

      console.log('objectToSave', objectToSave);
      localStorage.setItem(`${this.shortcuteLocalStoragePrefix}${this.authInfo.shortcutName}`, JSON.stringify(objectToSave));
      this.savedAuthAndUserInfos = this.findAuthDetailslist();
    }
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
}
