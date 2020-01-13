'use strict';

const PugView = use('app/helpers/pug-view');
const Auth = use('core/helpers/auth-helper');
const authConfig = use('config/auth');
const events = use('core/modules/events-module');

/**
 * Home controller
 */
function AuthController() {}
module.exports = AuthController;

/**
 * Login function
 */
AuthController.login = function login(req, res, next) {
    const pageRoute = 'auth.login';

    res.render(PugView.getView(pageRoute), {
        req,
        pageRoute,
    });
};

/**
 * Attempt function 
 */
AuthController.attempt = function attempt(req, res, next) {
    /* Get data */
    const data = {
        username: req.body.name,
        password: req.body.password,
    };

    /* Validate */
    /* TODO: CHECK USERNAME & PASSWORD */
    const user = {
        name: data.username,
        password: data.password,
    };

    /* If username & password are correct */
    const loginResult = {};

    if (user != null) {
        let token = Auth.sign({
            id: 100,
            username: data.username,
            password: data.password,
        });

        loginResult.success = true;
        loginResult.data = token;
    } else {
        loginResult.success = false;
        loginResult.data = "Invalid Username and Password";
    }

    /* Fire attempt-event */
    events.raise('login.attempt', loginResult);

    /* Send result */
    if (loginResult.success) {
        res.status(200)
            .send(loginResult)
            .end();
    } else {
        res.status(403)
            .send(loginResult)
            .end();
    }
};