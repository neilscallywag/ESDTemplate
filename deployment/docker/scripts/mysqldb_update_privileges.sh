#!/bin/sh
mysql -u root --password="password" -Bse "ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'password';flush privileges;"