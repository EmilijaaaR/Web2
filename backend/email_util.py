from re import sub
import smtplib
import email
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def sendEmail(to,subject, message):
    msg = MIMEMultipart()
    msg['From'] = 'web2.projekat2022@gmail.com'
    msg['To'] = to
    msg['Subject'] = subject
    msg.attach(MIMEText(message))

    mailserver = smtplib.SMTP('smtp.gmail.com',587)
    # identify ourselves to smtp gmail client
    mailserver.ehlo()
    # secure our email with tls encryption
    mailserver.starttls()
    # re-identify ourselves as an encrypted connection
    mailserver.ehlo()
    mailserver.login('web2.projekat2022@gmail.com', 'prtoxkvmdbzbnunq')

    mailserver.sendmail('me@gmail.com',to,msg.as_string())

    mailserver.quit()