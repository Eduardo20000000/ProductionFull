const express = require('express')
const {connectDB, loadUserData, createUser} = require('./DataBase/mongoose.js')
const cors = require('cors')
const fs = require('fs')
var certificate = fs.readFileSync('/etc/letsencrypt/live/' + 'api.connectapp.dpdns.org' + '/fullchain.pem');
var privatekey = fs.readFileSync('/etc/letsencrypt/live/' + 'api.connectapp.dpdns.org' + '/privkey.pem');
let https = require('https')
const app = express()
var credentials = {key: privatekey, cert: certificate};



app.use(cors({
    origin: "https://connectapp.dpdns.org"
}));
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(2083)
app.use(express.json())

connectDB()


app.get('/prod/v1/status', (req, res) => {

    res.send({success: true, message: "API is running."})
})
app.get('/prod/v1/createUser', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let {user, password} = req.query
    createUser(user, password).then((response) => {
        res.json(response)
    })
})
app.get('/prod/v1/addProgram', async (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let {user, password} = req.query
    let data = await loadUserData(user, password)
    if(!data.success) return res.json(data)
    let userData = data.user
    let {programPath} = req.query
    if(!programPath) return res.json({success: false, message: "No se encontro la ruta especificada."})
        userData.programsPaths.push(programPath)
        await userData.save()
        return res.json({success: true, message: "Añadadida la ruta a tu cuenta.", programsPaths: userData.programsPaths})
})
app.get('/prod/v1/validate-session', async (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let {username, token} = req.query
    let data = await loadUserData(username, token)
    if(!data.success) return res.json(data)
    return res.json({success: true, message: "Sesión válida.", user: data.user})
})