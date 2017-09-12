/*

Firebase initializes here

*/

// FIREBASE CONFIG
var config = {
    apiKey: "AIzaSyCYmEr20lO0yqLWtOIZCcmu3Ql354-1e30",
    authDomain: "myawesomeproject-783f9.firebaseapp.com",
    databaseURL: "https://myawesomeproject-783f9.firebaseio.com",
    projectId: "myawesomeproject-783f9",
    storageBucket: "myawesomeproject-783f9.appspot.com",
    messagingSenderId: "289250326133"
};

//INITIALIZE FIREBASE WEB APP
firebase.initializeApp(config);
var db = firebase.database();
var auth = firebase.auth();

//REDEFINE DOCUMENT AS LOCAL DOC
var doc = document;
window.snackbarContainer = doc.querySelector('#toast');

// PATHING
var subpath = 'OAS-System'
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        db.ref('members').on("value", function (snapshot) {
            // Convert object to data
            events.emit('updatedMembers', snapshot.val());
        });
    } else {
        // No user is signed in.
    }

});

