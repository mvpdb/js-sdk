class MvpDB {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    Login(username, password) {
        return new Promise((resolve, reject) => {
            fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                body: JSON.stringify({
                    email: username,
                    password: password,
                })
            }).then((resp)=>{
                if (resp.status !== 200) {
                    reject(resp);
                } else {
                    resp.json().then((respData)=>{
                        window.localStorage.setItem("mvpdb-auth", JSON.stringify(respData));
                        resolve();
                    });
                }
            }, (err) => {
                reject(err);
            });
        });
    }

    Register(username, password, first_name) {
        return new Promise((resolve, reject) => {
            fetch(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                body: JSON.stringify({
                    email: username,
                    password: password,
                    first_name: first_name,
                })
            }).then((resp)=>{
                if (resp.status !== 201) {
                    reject(resp);
                } else {
                    resp.json().then((respData)=>{
                        window.localStorage.setItem("mvpdb-auth", JSON.stringify(respData));
                        resolve();
                    });
                }
            }, (err) => {
                reject(err);
            });
        });
    }

    GetAuthToken() {
        try{
            const parsedData = JSON.parse(window.localStorage.getItem("mvpdb-auth"));
            return parsedData.authToken;
        } catch {
            return null;
        }
    }

    Logout() {
        return new Promise((resolve, reject) => {
            const oldToken = this.GetAuthToken();
            window.localStorage.setItem("mvpdb-auth", null);
            fetch(`${this.baseUrl}/auth/logout`, {
                headers: {'X-Session-Key': oldToken}
            }).then(resolve, reject);
        })
    }

    GetUserData() {
        return new Promise((resolve, reject) => {
            fetch(`${this.baseUrl}/auth/info`, {
                headers: {'X-Session-Key': this.GetAuthToken()}
            }).then((resp)=>{
                if(resp.status === 200) {
                    // User is logged in, set the user data
                    resp.json().then(resolve);
                } else {
                    reject(resp);
                }
            })
        })
    }

    IsLoggedIn() {
        try {
            const expiresAt = JSON.parse(window.localStorage.getItem("mvpdb-auth")).expiresAt;
            return expiresAt > (Date.now() / 1000)
        } catch {
            return false
        }
    }

    fetch(partialUrl, config) {
        return new Promise((resolve, reject) => {
            const newConfig = Object.assign({}, config);
            if(!newConfig.headers) {
                newConfig.headers = {};
            }
            newConfig.headers['X-Session-Key'] = this.GetAuthToken();
            const url = `${this.baseUrl+partialUrl}`
            fetch(url, newConfig).then((resp) => {
                if(parseInt(resp.status / 100) != 2) {
                    reject(resp);
                } else {
                    try {
                        resp.json().then((data)=>{
                            resolve(data);
                        });
                    } catch {
                        reject(resp);
                    }
                }
            }, (err) => {
                reject(err);
            });
        })
    }
}

window.MvpDB = MvpDB;
