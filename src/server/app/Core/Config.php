<?php

namespace Application;

interface Config {

	const HOST = 'localhost';
	const HOST_MAILER = 'smtp.gmail.com';
	const HOST_MAIL = 'jing2017coffee@gmail.com';
	const HOST_NAME = '靜咖啡';
	const CHARSET = 'utf-8';
	const ENCODING = 'base64';

	const DATABASE_USERNAME_ADMIN = 'admin';
	const DATABASE_PASSWORD_ADMIN = 'JiCoffeeAdmin134';
	const DATABASE_CAFE = 'Cafe';
	const DATABASE_PORT = 5435;

	// mail configuration

	const MAIL_PORT = 465;
	const SECURE_SSL = 'ssl';
	const SECURE_TLS = 'tls';

	const AUTH_TYPE = 'CRAM-MD5';
	
	const MAIL_USERNAME = 'sisp8111@gmail.com';
	const MAIL_PASSWORD = '087711662';

	const CTYPE_DIGIT = 'ctype_digit';

	const FIVE_MINUTE = 300;

	// const ORIGIN_TIMEZONE = 'UTC';
	// const TIMEZONE = 'Asia/Taipei';


}
