<?php

namespace Security;

class Encryption {

	private static $passwordOptions = array(
		'cost' => 11,
    	'salt' => null,
	);

	public static function base64($code) {
		return base64_encode($code);
	}

	public static function bindHex($code) {
		return bin2hex($code);
	}

	public static function passwordHash($code) {
		self::optionAddSalt();
		return password_hash($code, PASSWORD_BCRYPT, self::$passwordOptions);
	}

	private static function optionAddSalt() {
		self::$passwordOptions['salt'] = mcrypt_create_iv(22, MCRYPT_DEV_URANDOM);
	}

}