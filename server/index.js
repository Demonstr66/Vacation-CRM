const express = require('express');
const cors = require('cors');
const createError = require('http-errors');
const {initializeApp} = require('firebase-admin/app');
const admin = require("firebase-admin");
const serviceAccount = require("./setting.json");
const {getAuth} = require("firebase-admin/auth");

const app = express();
const PORT = 3000

initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vacationcrm-d3ff2-default-rtdb.asia-southeast1.firebasedatabase.app"
});

function checkUser({token, uid}) {
    console.log('findUser...')

    if (!token && !uid) return Promise.reject({message: 'invalid parameters'})

    if (token) return getAuth().verifyIdToken(token)
    if (uid) return getAuth().getUser(uid)
}

function checkPermission(user) {
    console.log('checking...')
}

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

app.get('/currentUser/set/permission/base', async (req, res, next) => {
    const {u: uid, o: owner} = req.query

    console.log(uid)
    console.log(req.query)

    if (!uid) return next(createError(403, 'invalid parameters'))

    checkUser({uid})
        .then(user => {
            if (user.admin) return next(createError(402, 'access decided'))

            getAuth().setCustomUserClaims(user.uid, {
                admin: owner ? true : false,
                role: owner ? 'admin' : 'user',
                workspace: user.photoURL
            })

            res.json({message: 'success'})
        })
        .catch(err => {
            next(createError(401, err.message))
        })
});


app.use((req, res, next) => {
    next(createError(404))
})

app.use((error, req, res, next) => {
    res.status(error.status)
    res.json(error)
})

app.listen(PORT, () => {
    console.log('listen port ' + PORT)
});