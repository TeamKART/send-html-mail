"use strict"
var fs = require('fs')

var emailPatt = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    validServices = ["1und1", "AOL", "DebugMail.io", "DynectEmail", "FastMail", "GandiMail", "Gmail", "Godaddy", "GodaddyAsia", "GodaddyEurope", "hot.ee", "Hotmail", "iCloud", "mail.ee", "Mail.ru", "Mailgun", "Mailjet", "Mandrill", "Naver", "Postmark", "QQ", "QQex", "SendCloud", "SendGrid", "SES", "Sparkpost", "Yahoo", "Yandex", "Zoho"]

var options = require('command-line-args')([
    { name: 'user', alias: 'u', type: String },
    { name: 'pass', alias: 'p', type: String },
    { name: 'service', type: String },
    { name: 'headers', alias: 'h', type: String },
    { name: 'list', alias: 'l', type: String },
    { name: 'proxy', type: String },
    { name: 'to', alias: 't', type: String, multiple: true },
    { name: 'cc', alias: 'c', type: String, multiple: true },
    { name: 'bcc', type: String, multiple: true },
    { name: 'subject', alias: 's', type: String },
    { name: 'replyTo', alias: 'r', type: String },
    { name: 'from', alias: 'f', type: String },
    { name: 'name', alias: 'n', type: String },
    { name: 'body', alias: 'b', type: String },
    { name: 'text', type: Boolean },
    { name: 'noproxy', type: Boolean },
    { name: 'debug', type: Boolean }
])

JSON.test = function (str) {
    try { JSON.parse(str) }
    catch (e) { return false }
    return true
}

options.user = options.user || process.env.MGUSERNAME
options.pass = options.pass || process.env.MGPASSWORD
options.service = options.service || 'Mailgun'
options.from = options.from || options.user
if (!options.noproxy)
    options.proxy = options.proxy || process.env.HTTP_PROXY

if (!options.user || !options.pass || !emailPatt.test(options.user))
    throw new Error('Error in Login Credentials')
if (!options.to || !options.to.length)
    throw new Error('To address Not found')
if (options.replyTo && !emailPatt.test(options.replyTo))
    throw new Error('ReplyTo email not valid')
if (options.from && !emailPatt.test(options.from))
    throw new Error('ReplyTo email not valid')
if (!options.body)
    throw new Error('Body is required')
if ((options.headers && !JSON.test(options.headers)) || (options.list && !JSON.test(options.list)))
    throw new Error('Invalid JSON detected')
if (options.service && validServices.indexOf(options.service) === -1)
    throw new Error('Invalid Service')
fs.stat(options.body, function (e, s) {
    if (e)
        throw new Error('File not found')

    options.to = options.to.join()
    if (options.cc)
        options.cc = options.cc.join() || undefined
    if (options.bcc)
        options.bcc = options.bcc.join() || undefined
    if (options.headers)
        options.headers = JSON.parse(options.headers)
    if (options.list)
        options.list = JSON.parse(options.list)

    var transport = require('nodemailer').createTransport({
        service: options.service,
        auth: {
            user: options.user,
            pass: options.pass
        },
        logger: options.debug,
        debug: options.debug,
        proxy: options.proxy
    })

    if (!options.text)
        transport.use('compile', require('nodemailer-html-to-text').htmlToText())

    var mailOptions = {
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        list: options.list,
        headers: options.headers,
        from: (options.name || '') + '<' + options.from + '>',
        replyTo: options.replyTo
    }
    if (options.text)
        mailOptions.text = fs.readFileSync(options.body, 'utf-8')
    else
        mailOptions.html = fs.readFileSync(options.body, 'utf-8')

    transport.sendMail(mailOptions, function (e, r) {
        if (e)
            throw e
        else
            console.log(r)
    })
})
