// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // firebaseConfig: {
  //   apiKey: "AIzaSyALJjtr18BXFKpPGhJcZAMpLOxQQFNV80c",
  //   authDomain: "borrowed-e20121991.firebaseapp.com",
  //   databaseURL: "https://borrowed-e20121991.firebaseio.com",
  //   projectId: "borrowed-e20121991",
  //   storageBucket: "borrowed-e20121991.appspot.com",
  //   messagingSenderId: "1047818728433",
  //   appId: "1:1047818728433:web:3d5d9f5c14db27fa"
  // },
  firebaseConfig: {
    apiKey: "AIzaSyD0flu24AmI3hp7B0d-WpofvzaOLCyCnUM",
    authDomain: "borrowed-o20121991.firebaseapp.com",
    databaseURL: "https://borrowed-o20121991.firebaseio.com",
    projectId: "borrowed-o20121991",
    storageBucket: "",
    messagingSenderId: "1064266627070",
    appId: "1:1064266627070:web:ac7d456926f51f96"
  },
  googlePlusConfig: {
    'webClientId': '1064266627070-ar5jqmoj2tsum88j6qbb6r01f69pimvt.apps.googleusercontent.com',
    'offline': true
  },
  // googlePlusConfig: {
  //   'webClientId': '1047818728433-2sv9hhicv63bqvj0cqah1sjpcpkntnfb.apps.googleusercontent.com',
  //   'offline': true
  // },
  bannerAdConfig: {
    isTesting: true,
    autoShow: true
  },
  interstitialAdConfig: {
    isTesting: true,
    autoShow: true
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
