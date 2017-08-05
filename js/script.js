document.addEventListener('DOMContentLoaded', function () {
    // Initialize Firebase
    // Firebase config
    var config = {
        apiKey: "AIzaSyCYmEr20lO0yqLWtOIZCcmu3Ql354-1e30",
        authDomain: "myawesomeproject-783f9.firebaseapp.com",
        databaseURL: "https://myawesomeproject-783f9.firebaseio.com",
        projectId: "myawesomeproject-783f9",
        storageBucket: "myawesomeproject-783f9.appspot.com",
        messagingSenderId: "289250326133"
    };
    firebase.initializeApp(config);
    var db = firebase.database();
    var auth = firebase.auth();

    //REDEFINE DOCUMENT AS LOCAL DOC
    var doc = document;
    window.snackbarContainer = doc.querySelector('#toast');

    // var bigOne = document.getElementById('bigOne');
    // var dbRef = firebase.database().ref().child('Text');
    // dbRef.on('value', snap => bigOne.innerText = snap.val())




    // VARIABLES

    var loginButton = doc.getElementById('login-button');
    var passwordInputMdlTextfield = doc.getElementById('password-input-mdl-textfield');


    // SHARED
    var email = null;
    var provider = null;
    var displayName = null;
    var photoUrl = null;
    var uid = null;
    var verifiedUser = false;

    var accountButton = doc.getElementById('account-menu-button');


    // LOGIN PAGE
    if (loginButton) {
        loginButton.addEventListener("click", function () {
            var usernameInput = doc.getElementById('username-input');
            var passwordInput = doc.getElementById('password-input');
            var email = usernameInput.value;
            var password = passwordInput.value;

            if (!email) {
                toast('Username Required');
                usernameInput.focus();
                usernameInput.parentNode.classList.add('is-dirty');
            } else if (!password) {
                toast('Password Required');
                passwordInput.focus();
                passwordInput.parentNode.classList.add('is-dirty');
            } else {
                loginUsername(email, password);
            }
        });
    }

    if (passwordInputMdlTextfield) {
        //ENABLE LOGIN BUTTON
        passwordInputMdlTextfield.addEventListener("input", function () {
            if (this != null) {
                loginButton.disabled = false;
            }
        });
        //PRESS ENTER
        passwordInputMdlTextfield.addEventListener("keyup", function (e) {
            e.preventDefault();
            if (e.keyCode == 13) {
                loginButton.click();
            }
        });
    }

    /* SHARED FUNCTIONS FUNCTIONS */

    // TOP RIGHT USER ELEMENT SWITCH
    function loadAccountChip(msg) {
        accountButton.innerHTML = '';

        //MSG SHORT CIRCUIT PROVIDES MEMBER ACCESS UPON EMAIL VERIFIED PAGE LOAD
        if (msg) {
            if (displayName) {
                signInButton.style.display = "none";
                accountButton.style.display = "inline";
            } else {
                signInButton.style.display = "inline";
                accountButton.style.display = "inline";
            }

        } else {
            if (!uid || !displayName) {
                signInButton.style.display = "inline";
                accountButton.style.display = "none";
            } else {
                signInButton.style.display = "none";
                accountButton.style.display = "inline";
            }
        }

        if (msg) {

        } else {
            if (!verifiedUser && provider == "password") {
                signInButton.style.display = "none";
                return;
            }
        }

        accountButton.innerHTML = '<span> ' + displayName + ' </span><ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="account-menu-button"><li class="mdl-menu__item" id="account-settings-button">Account Settings</li><li class="mdl-menu__item" id="sign-out-button">Logout</li></ul>';

        var signOutButton = doc.getElementById('sign-out-button');
        var accountSettingsButton = doc.getElementById('account-settings-button');

        signOutButton.addEventListener("click", function () {
            signout();
        });

        accountSettingsButton.addEventListener("click", function () {
            redirect("/account");
        });

        window.componentHandler.upgradeAllRegistered();
    }

    /* FUNCTIONS */


    function loginUsername(email, password) {
        auth.signInWithEmailAndPassword(email, password).then(function (value) {
            //NEED TO PULL USER DATA?
            redirect("https://tangyjon.github.io/OAS-System/");
        }).catch(function (error) {
            email += "@scout33.org"
            auth.signInWithEmailAndPassword(email, password).then(function (value) {
                //NEED TO PULL USER DATA?
                redirect("https://tangyjon.github.io/OAS-System/");
            }).catch(function (error) {
                toast(error.message, 7000);
            });
        });
    }

    //TOAST
    function toast(msg, timeout) {
        if (!timeout) { timeout = 2750 }
        var data = {
            message: msg,
            timeout: timeout
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };



}, false);