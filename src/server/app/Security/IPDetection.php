<?php

namespace App\Security;

class IPDetection {

	private static $serverType = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_FORWARDED', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR'];

	public static function fetchIP() {
		foreach (self::$serverType as $key) {
			if (isset($_SERVER[$key])) {
				return $_SERVER[$key];
			}
		}
	}

}
