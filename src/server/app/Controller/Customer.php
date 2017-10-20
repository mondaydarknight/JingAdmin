<?php

namespace App\Controller;

use PDO;
use Interop\Container\ContainerInterface;
use Slim\Http\Request;
use Slim\Http\Response;

class Customer {
	/**
     * @var ContainerInterface
     */
    protected $container;

    /**
     * @var Response
     */
    protected $response;


    public function __construct(ContainerInterface $container) {
    	$this->container = $container;
    }

    public function responseNormalStatus($result) {
        return $this->response->withJson($result, 200);
    }

    public function searchCustomer(Request $request, Response $response) {
    	$this->response = $response;
    	
    	$stmt = $this->container->pdo->prepare('SELECT id, username, email FROM member WHERE status = :memberStatus');
    	$stmt->execute([':memberStatus' => ' ']);
    	
    	return $stmt->rowCount() > 0 
    	? $this->responseNormalStatus(['success' => true, 'members' => $stmt->fetchAll(PDO::FETCH_ASSOC)])
    	: $this->responseNormalStatus(['success' => false]);
    }

    public function searchCustomerDetail(Request $request, Response $response) {
        $this->response = $response;

        $memberId = filter_var($request->getQueryParams()['memberId'], FILTER_VALIDATE_INT);

        $stmt = $this->container->pdo->prepare('SELECT username, phone, email, sex FROM member WHERE status = :memberStatus AND id = :memberId');
        $stmt->execute([':memberStatus' => ' ', ':memberId' => $memberId]);
        
        return $stmt->rowCount() > 0 
        ? $this->responseNormalStatus(['success' => true, 'member' => $stmt->fetch(PDO::FETCH_ASSOC)])
        : $this->responseNormalStatus(['success' => false]); 
    }

}