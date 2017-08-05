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

    var signInButton = doc.getElementById('sign-in-button');
    var accountButton = doc.getElementById('account-menu-button');
    var helpButton = doc.getElementById('help-button');
    var drawer = doc.getElementsByClassName('mdl-layout__drawer')[0];
    var navLinks = drawer.getElementsByClassName('mdl-navigation')[0];


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

    /* FIREBASE METHODS */

    //FIREBASE AUTH STATE CHANGE METHOD
    auth.onAuthStateChanged(function (user) {
        if (user) {
            provider = user.providerData[0].providerId ? user.providerData[0].providerId : null;
            verifiedUser = user.emailVerified ? user.emailVerified : null;
            displayName = user.displayName ? user.displayName : null;
            email = user.email ? user.email : null;
            photoUrl = user.photoURL ? user.photoURL : null;
            uid = user.uid ? user.uid : null;

            switch (provider) {
                case 'facebook':
                case 'github':
                case 'google':
                case 'twitter':
                    break;
                case 'password':
                    if (!verifiedUser) {

                        if (loginCard && logoutCard && noticeCard) {
                            loginCard.style.display = "none";
                            logoutCard.style.display = "none";
                            noticeCard.style.display = "inline";
                        }

                        //kick unvalidated users to the login page
                        redirect('login');

                        //break out of function logic here
                        return;
                    }
                    break;
                //var isAnonymous = user.isAnonymous;
            }

            verifiedUser = true;

            if (loginCard && logoutCard && noticeCard) {
                loginCard.style.display = "none";
                logoutCard.style.display = "inline";
                noticeCard.style.display = "none";
            }

            if (deleteAccountButton) {
                // any logged in user can delete their account
                deleteAccountButton.disabled = false;

                deleteAccountButton.addEventListener("click", function () {
                    deleteAccount();
                });
            }

            if (pwdUsersOnlyDiv) {
                if (provider == "password") {
                    if (verifiedUser) {
                        // display account update options
                        pwdUsersOnlyDiv.style.display = "inline";

                        //enable email submit button only if input not empty
                        newEmailInputMdlTextfield.addEventListener("input", function () {
                            if (this != null) {
                                newEmailSubmitButton.disabled = false;
                            }
                        });

                        newEmailSubmitButton.addEventListener("click", function () {
                            var newEmailInputArg = newEmailInput.value;
                            newEmail(newEmailInputArg);
                        });

                        newPasswordSubmitButton.addEventListener("click", function () {
                            newPasswordViaEmailReset(email);
                        });

                    } else {
                        // tell them to verify first
                    }
                }
            }
            //ENABLE BUTTON AND LINKS
            if (privatePageButton) {
                privatePageButton.disabled = false;
            }
            addPrivateLinkToDrawer();

            //USER NOT SIGNED IN
        } else {

            //NULLIFY SHARED USER VARIABLES
            provider = null;
            verifiedUser = null;
            displayName = null;
            email = null;
            photoUrl = null;
            uid = null;

            //DISABLE BUTTON AND LINKS
            if (privatePageButton) {
                privatePageButton.disabled = true;
            }
            removePrivateLinkFromDrawer();

            if (loginCard && logoutCard && noticeCard) {
                loginCard.style.display = "inline";
                logoutCard.style.display = "none";
                noticeCard.style.display = "none";
            }
        }

        //ADJUST USER CHIP IN ANY CASE
        loadAccountChip();
    });

    /* FUNCTIONS */


    function loginUsername(email, password) {
        auth.signInWithEmailAndPassword(email, password).then(function (value) {
            //NEED TO PULL USER DATA?
            window.location = '/';
        }).catch(function (error) {
            email += "@scout33.org"
            auth.signInWithEmailAndPassword(email, password).then(function (value) {
                //NEED TO PULL USER DATA?
                // redirect('login');
                window.location = '/';
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