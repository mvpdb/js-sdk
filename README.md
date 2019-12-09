# Javascript Client SDK
If coding in javascript, the Mvp DB javascript SDK is a convenient way to interface with your data. It has helper methods for user registration / sign up flows, as well as for accessing your apis. The javascript SDK is available on our [github page](https://github.com/mvpdb/js-sdk).

### Usage
The SDK is small javascript class containing the following methods:
```javascript
class MvpDB {
    constructor(baseUrl)

    Login(username, password) {}

    Register(username, password, first_name) {}

    GetAuthToken() {}

    Logout() {}

    GetUserData() {}

    IsLoggedIn() {}

    fetch(partialUrl, config) {}
}
```

To use, place sdk in the top of your html <head> tag:

```html
<head>
  ...
  <script src="https://www.mvpdb.io/mvpdb.js"></script>
	...
</head>
```

Then, at the loading of your application, instantiate the client for use:
```javascript
// Replace url below with your company's base url
const mvpdb = window.MvpDB("https://abc.mvpdb.io")
```

*Note: All below examples assume you have instantiated an MvpDB client under the variable name `mvpdb` as done above*

##### Fetching Data
Fetching data uses the `Fetch()` sdk helper. Unauthenticated requests need no preparation, as they do not rely on any session data:
```javascript
// Unauthenticated Request
mvpdb.fetch('/api/api_name').then( (results) => {
  // Do stuff with results
  console.log(results);
}, alert);
```

For an authenticated request (one that [may require login](https://docs.mvpdb.io/apis#any-logged-in-user)), a user must be logged in beforehand:
```javascript
// Authenticated Request (only need to Login() once)
mvpdb.Login('username', 'password').then(()=>{
  mvpdb.fetch('/api/api_name').then( (results) => {
    // Do stuff with results
    console.log(results);
  }, alert);
})
```

Since a user session is saved on local storage, a common pattern is to check if the user is logged in, and if so, fetch results:
```javascript
if(mvpdb.IsLoggedIn()) {
  mvpdb.fetch(''/api/api_name').then( (results) => {
    // Do stuff with results
    console.log(results);
  }, alert);
}
```

##### User Registration
To register a new user, use `Register()` helper. Upon a successful registration request, a session token will be added to the browsers local storage. All subsequent calls to `.fetch()` from the SDK will be authenticated by that user. In this example, we simple redirect to the homepage on successful registration:
```javascript
mvpdb.Register(username, password, "").then( () => { window.location = "/" } );
```

##### User Login
To login a user that already has an account, we use the provided `Login()` helper. Upon a successful login request, a session token will be added to the browsers local storage. All subsequent calls to `.fetch()` from the SDK will be authenticated by that user. In our example, we simple redirect to the homepage on successful login:
```javascript
mvpdb.Login(username, password).then( () => { window.location = '/' } );
```

##### User Info
To figure out if a user is logged in - and if so, retrieve the users details (email, name, etc) - We use the `IsLoggedIn()` helper. If the user is indeed logged in, the following api will contain an object with the users details.
```javascript
if(mvpdb.IsLoggedIn()) {
  mvpdb.GetUserData().then((data)=>{
    // Do stuff with user data
    console.log(data);
  });
}
```

##### User Logout
To logout a user, simply call the SDK helper `Logout()`. This will clear the users session. In our example, we simply redirect to the homepage on successful logout.
```javascript
mvpdb.Logout().then( () => { window.location = "/" } );
```
