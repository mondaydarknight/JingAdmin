<?php

use Adbar\Session;
use Slim\Container;

$container = $app->getContainer();

$container['pdo'] = function(Container $c) {
	$settings = $c->get('settings')['pdo'];

	return new PDO($settings['dsn'], $settings['username'], $settings['password']);
};

$container['session'] = function(Container $c) {
	return new Session($c->get('settings')['session']['namespace']);
};

$container['App\Controller\Home'] = function($c) {
	return new App\Controller\Home($c);
};

$container['App\Controller\Order'] = function($c) {
	return new App\Controller\Order($c);
};

$container['App\Controller\Customer'] = function($c) {
	return new App\Controller\Customer($c);
};
