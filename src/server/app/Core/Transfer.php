<?php

namespace App\Core;

class Transfer {

	public static function countArrayAmount($array) {
		return str_repeat('?,', count($array) - 1) . '?';
	}

}