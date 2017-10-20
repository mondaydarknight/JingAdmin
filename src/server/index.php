<?php

require_once 'deploy.directory.php';

require_once __DIR__ . '/../../vendor/autoload.php';

use Slim\App;
use Adbar\SessionMiddleware;


$settings = require_once 'settings.php';

$app = new App($settings);

$app->add(new SessionMiddleware($settings['settings']['session']));

require_once 'dependencies.php';

require_once 'routes.php';



$app->run();
