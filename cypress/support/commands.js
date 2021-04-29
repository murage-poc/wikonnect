import "cypress-file-upload";

Cypress.Commands.add('login', function () {
  cy.fixture('user').then(user => {
    cy.request({
      method: 'POST',
      url: '/api/v1/auth',
      body: {
        username: user.username,
        password: user.password
      }
    })
      .its('body')
      .then(res => {
        this.token = res.token;
        window.localStorage.setItem('ember_simple_auth-session', JSON.stringify({
          "authenticated": {
            "authenticator": "authenticator:jwt",
            "token": res.token,
            "exp": Math.floor(new Date().getTime() / 1000) + 1000 * 60 * 60,
            "tokenData": {
              "id": user.id,
              "iat": Math.floor(new Date().getTime() / 1000),
              "exp": Math.floor(new Date().getTime() / 1000) + 1000 * 60 * 60
            }
          }
        }));
      });
  });
});


Cypress.Commands.add('chapters', (queryParams = {}) => {
    const qs = Object.keys(queryParams).reduce((acc, key) => {
        acc += `${key}=${queryParams[key]}&`;
        return acc;
    }, '')

    let headers = {'Accept': `application/json`}

    // check if user is authenticated
    const session = window.localStorage.getItem('ember_simple_auth-session');
    if (session) {
        const parsed = JSON.parse(session);
        if (parsed.authenticated && parsed.authenticated.token) {
            headers = {...headers, 'Authorization': `Bearer ${parsed.authenticated.token}`}
        }
    }

    return cy.request({
        method: 'GET',
        url: `/api/v1/chapters?${qs}`,
        headers: headers
    })
    .its('body.chapters')
    .then((chapters) => chapters);
});

Cypress.Commands.add('comments', (queryParams = {}) => {
    const qs = Object.keys(queryParams).reduce((acc, key) => {
        acc += `${key}=${queryParams[key]}&`;
        return acc;
    }, '')

    let headers = {'Accept': `application/json`}

    // check if user is authenticated
    const session = window.localStorage.getItem('ember_simple_auth-session');
    if (session) {
        const parsed = JSON.parse(session);
        if (parsed.authenticated && parsed.authenticated.token) {
            headers = {...headers, 'Authorization': `Bearer ${parsed.authenticated.token}`}
        }
    }

    return cy.request({
        method: 'GET',
        url: `/api/v1/comments?${qs}`,
        headers: headers
    })
        .its('body.comment')
        .then((chapters) => chapters);
});

Cypress.Commands.add('loginByGoogleApi', () => {
  cy.log('Logging in to Google')
  cy.request({
    method: 'POST',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    body: {
      grant_type: 'refresh_token',
      client_id: Cypress.env('googleClientId'),
      client_secret: Cypress.env('googleClientSecret'),
      refresh_token: Cypress.env('googleRefreshToken'),
    },
  }).then(({ body }) => {
    const { access_token, id_token } = body
    console.log(id_token);
    console.log(access_token);

    cy.request({
      method: 'GET',
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      headers: { Authorization: `Bearer ${access_token}` },
    }).then(({ body }) => {
      cy.log(body)
      const userItem = {
        token: id_token,
        user: {
          googleId: body.sub,
          email: body.email,
          givenName: body.given_name,
          familyName: body.family_name,
          imageUrl: body.picture,
        },
      }

      window.localStorage.setItem('googleCypress', JSON.stringify(userItem))
      cy.visit('/')
    })
  })
})