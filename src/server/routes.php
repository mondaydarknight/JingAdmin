<?php

use App\Controller\Home;

$app->get('/isUserAdmin', '\App\Controller\Home:isUserAdmin');

$app->post('/login', '\App\Controller\Home:login');

$app->post('/logout', '\App\Controller\Home:logout');

$app->get('/searchTodayOrder', 'App\Controller\Order:searchTodayOrder');

$app->get('/searchOrderByCustomer', 'App\Controller\Order:searchOrderByCustomer');

$app->get('/searchOrderByDate', 'App\Controller\Order:searchOrderByDate');

$app->put('/manageOrder', 'App\Controller\Order:manageOrder');

$app->get('/searchCustomer', 'App\Controller\Customer:searchCustomer');

$app->get('/searchCustomerDetail', 'App\Controller\Customer:searchCustomerDetail');
