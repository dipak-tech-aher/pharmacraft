server {
	listen  80 default_server;
	location ~hubertonfintech/ {
		root  "/home/hubertonfintech/public_html";
		index  index.html index.htm index.php;
		try_files $uri $uri/ /index.php?$args;
	}
	location ~pharmakraftpacka/ {
		root  "/home/pharmakraftpacka/public_html";
		index  index.html index.htm index.php;
		try_files $uri $uri/ /index.php?$args;
	}
	location ~* \.php$ {
		root   "/etc/sentora/panel/etc/static/pages/";
		fastcgi_pass 127.0.0.1:9002;
		
		if ($request_uri ~ ~hubertonfintech/.*$) {
			root  "/home/hubertonfintech/public_html";
			fastcgi_pass unix:/var/run/php-fpm/hubertonfintech.sock;
		}
		if ($request_uri ~ ~pharmakraftpacka/.*$) {
			root  "/home/pharmakraftpacka/public_html";
			fastcgi_pass unix:/var/run/php-fpm/pharmakraftpacka.sock;
		}
		fastcgi_index index.php;
		include fastcgi_params;
		fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
		fastcgi_param SCRIPT_NAME $fastcgi_script_name;
	}
	location / {
		root   /etc/sentora/panel/etc/static/pages/;
		index  index.html index.htm;
	}
	error_page  500 502 503 504  /50x.html;
		include fastcgi_params;
			location = /50x.html {
			root  /usr/share/nginx/html;
	}
}
