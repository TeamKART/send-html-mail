#send-html-mail
##Node.js script for sending HTML or Text emails from the command line

###Requirements
* [Node.js](https://nodejs.org/en/download/)

###Example
Body of an html email is stored in path/email.html to be sent to recipient1@domain.com and recipient2@domain.com with subject `Hello world`

Username: sender@domain.com

Password: 123456

Open a new shell (PowerShell if windows), go to the folder where the repo was cloned to and execute any of the following

`node send --user sender@domain.com --pass 123456 --to recipient1@domain.com recipient2@domain.com --subject "TEST mail" --body "path/email.html"`

`node send -u sender@domain.com -p 123456 -t recipient1@domain.com recipient2@domain.com -s "TEST mail" -b "path/email.html"`

`node send -u sender@domain.com -p 123456 -t recipient1@domain.com -t recipient2@domain.com -s "TEST mail" -b "path/email.html"`

###Options

* Username: `--user` or `-u`

    Username. Required. Must be a valid email ID. If variable is absent, environment variable MGUSERNAME is used
* Password: `--pass` or `-p`

    Password. Required. If variable is absent, environment variable MGPASSWORD is used
* Service: `--service`

    Default value is "Mailgun". List of supported services are [here](https://nodemailer.com/2-0-0-beta/setup-smtp/well-known-services/)
* Proxy Server: `--proxy`

    If variable is absent, environment variable HTTP_PROXY is used. The proxy server must support SMTP transport
* To: `--to -t`

    Recipients. At least one is required
* Cc: `--cc -c`
* Bcc: `--bcc`
* Subject: `--subject -s`
* ReplyTo: `--replyTo -r`

    ReplyTo address. If present, must be a valid Email ID
* From: `--from -f`

    Must be a valid email ID. Default value is the Username
* Name: `--name -n`

    Sender's displayed name
* Body: `--body -b`

    Body of the mail. Must be a valid file path.
* Headers: `--headers -h`

    Additional mail headers. The string must be JSON. For example:
    
    ```
    --headers "{`"X-Mailgun-Campaign-Id`":`"foobar`"}"
    ```
* List: `--list -l`

    List headers. The string must be JSON. For example:
    
    ```
    --list "{`"unsubscribe`":`"%unsubscribe_email%`"}"
    ```
* Text Mode: `--text`

    If variable is present, mail will be sent as text message and not HTML
* Debug Mode: `--debug`

    Turn on debugger mode

####Within IIT KGP
KGP's proxy server will not work with this because it doesn't support some necessary features for SMTP transport
