global.fetch = require('node-fetch')
require('dotenv').load();

var AWS = require('aws-sdk');
var AWSCognito = require('amazon-cognito-identity-js');

AWS.config.region = process.env.REGION;
var poolData = {
  UserPoolId : process.env.USER_POOL,
    ClientId : process.env.CLIENT_ID
};

var userPool = new AWSCognito.CognitoUserPool(poolData);
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.getCurrentUser = function() {
  return userPool.getCurrentUser();
};

exports.getUser = function(accessToken) {
  console.log(`Getting user for token: `, accessToken);
  var params = {
    AccessToken: accessToken
  }

  return new Promise(function(resolve, reject) {
    cognitoidentityserviceprovider.getUser(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
        return;
      }
      resolve(data);
      console.log(`FOUND `, data);
    });
  });
};

exports.register = function(login, password, email, name, family_name) {
  console.log(`Registering user with login ${login} password ${password} email ${email} name ${name} family name ${family_name} `);

  var userPool = new AWSCognito.CognitoUserPool(poolData);

  var attributeList = [];
  
  var dataEmail = {
      Name : 'email',
      Value : email
  };

  var dataName = {
    Name: 'name',
    Value: name
  }
  
  var dataFamilyName = {
    Name: 'family_name',
    Value: family_name
  }

  var attributeEmail = new AWSCognito.CognitoUserAttribute(dataEmail);
  var attributeName = new AWSCognito.CognitoUserAttribute(dataName);
  var attributeFamilyName = new AWSCognito.CognitoUserAttribute(dataFamilyName);

  attributeList.push(attributeEmail);
  attributeList.push(attributeFamilyName);
  attributeList.push(attributeName);

  //return new Promise(function(resolve, reject){
    userPool.signUp(login, password, attributeList, null, function(err, result){
        if (err) {
          console.log(`Problem creating user ${JSON.stringify(err)}`);
          //reject(err);
        }
        else{
          console.log(`User successfully created ${JSON.stringify(result)}`)
          cognitoUser = result.user;
          //reslove(cognitoUser);
        }

    });
  //});
}

exports.login = function(login, password) {
  console.log(`Authenticating with cognito ${login} / ${password}`);

  var authenticationData = {
      Username : login,
      Password : password,
  };
  var authenticationDetails = new AWSCognito.AuthenticationDetails(authenticationData);
  var userData = {
      Username : login,
      Pool : userPool
  };
  var cognitoUser = new AWSCognito.CognitoUser(userData);

  return new Promise(function(resolve, reject) {
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();

            resolve(result);

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : 'eu-west-2:61ae2fab-c204-4578-83b3-c0973838c372',
                Logins : {
                    // Change the key below according to the specific region your user pool is in.
                    'cognito-idp.eu-west-2.amazonaws.com/eu-west-2_rmmxQMcc8' : result.getIdToken().getJwtToken()
                }
            });

            //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
            AWS.config.credentials.refresh((error) => {
                if (error) {
                     console.error(error);
                } else {
                     // Instantiate aws sdk service objects now that the credentials have been updated.
                     // example: var s3 = new AWS.S3();
                    console.log(`Token :`, result);
                }
            });
        },

        onFailure: function(err) {
            var errorMessage = err.message || JSON.stringify(err)
            console.log(errorMessage);
            reject(errorMessage);
        },
    });
  });

};

