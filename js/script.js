document.addEventListener('DOMContentLoaded', function() {
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

    var bigOne = document.getElementById('bigOne');
    var dbRef = firebase.database().ref().child('Text');
    dbRef.on('value', snap=> bigOne.innerText = snap.val())





























}());