# DOMAIN: billing.pharmakraftpackaging.com
<virtualhost *:80>
ServerName billing.pharmakraftpackaging.com
ServerAlias  www.billing.pharmakraftpackaging.com
ServerAlias  mail.billing.pharmakraftpackaging.com
ServerAlias  www.mail.billing.pharmakraftpackaging.com
ServerAdmin dipak.tech.aher@gmail.com 
DocumentRoot "/home/pharmakraftpacka/billing_pharmakraftpackaging_com"
#php_admin_value open_basedir "/home/pharmakraftpacka:/tmp/:/tmp/:/var/lib/php/session/"
#ErrorLog "/var/sentora/logs/domains/pharmakraftpacka/billing.pharmakraftpackaging.com-error.log" 
#CustomLog "/var/sentora/logs/domains/pharmakraftpacka/billing.pharmakraftpackaging.com-access.log" combined
#CustomLog "/var/sentora/logs/domains/pharmakraftpacka/billing.pharmakraftpackaging.com-bandwidth.log" common
Redirect /webmail http://billing.pharmakraftpackaging.com:2095
Redirect /webmail/ http://billing.pharmakraftpackaging.com:2095
Redirect /acp http://billing.pharmakraftpackaging.com:2086
Redirect /acp/ http://billing.pharmakraftpackaging.com:2086
Redirect /ucp http://billing.pharmakraftpackaging.com:2082
Redirect /ucp/ http://billing.pharmakraftpackaging.com:2082
##suPHP##
<IfModule mod_suphp.c>
        suPHP_Engine on
        suPHP_UserGroup pharmakraftpacka pharmakraftpacka
        suPHP_ConfigPath /etc/sentora/configs/apache/fcgi-config/pharmakraftpacka
        <FilesMatch "\.php[345]?$">
                SetHandler application/x-httpd-php70
        </FilesMatch>
        suPHP_AddHandler application/x-httpd-php70 .php .php5
</IfModule>
##EndsuPHP##
SecRuleEngine On
SecRequestBodyAccess On
SecTmpSaveUploadedFiles On
<Directory "/home/pharmakraftpacka/billing_pharmakraftpackaging_com">
  AllowOverride All
    Require all granted
</Directory>
AddType application/x-httpd-php .php3 .php
ErrorDocument 403 /_errorpages/403.html
ErrorDocument 404 /_errorpages/404.html
ErrorDocument 500 /_errorpages/500.html
ErrorDocument 510 /_errorpages/510.html
DirectoryIndex index.html index.htm index.php index.asp index.aspx index.jsp index.jspa index.shtml index.shtm
# Custom Global Settings (if any exist)

# Custom VH settings (if any exist)

</virtualhost>
# END DOMAIN: billing.pharmakraftpackaging.com
################################################################
