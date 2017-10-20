<?php

namespace App\Core;

use DateTime;

class Time {

	private static $current = null;

	public static function getCurrentTimeOnlyNumber() {
		self::$current = new DateTime();
		return self::$current->format('YmdHis');
	}

	public static function transferOnlyMonth($date) {
		return substr($date, 0, 4) .'/'. substr($date, 4, 2) .'/'. substr($date, 6, 2);
	}

}