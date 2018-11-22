// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const region = 'eu-west-2';

export const environment = {
    production: false,
    region: region,
    userPoolId: `${region}_rmmxQMcc8`,
    identityPoolId: `${region}:61ae2fab-c204-4578-83b3-c0973838c372`,
    clientId: '3vm9u4heh4udklt7n0853q8fj9'
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

