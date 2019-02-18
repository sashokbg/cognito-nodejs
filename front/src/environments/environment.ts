// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const region = 'eu-west-1';

export const environment = {
    production: false,
    region: region,
    userPoolId: `${region}_Vzb5mzwMu`,
    identityPoolId: `${region}:aa0c57d0-da3d-4bb9-b78c-1578e56a243d`,
    clientId: '33i5noit6u8kmtgn02ljt48uvd'
};

// Alex
// export const environment = {
//     production: false,
//     region: region,
//     userPoolId: `${region}_WC6Dj24iI`,
//     // identityPoolId: `${region}:f30a972c-2f62-41ca-9b88-d46fa041ae1b`,
//     clientId: '6m9lvj8kd2b42hmt8npph0bbuk'
// };


/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

