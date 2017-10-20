<?php

namespace App\Controller;

use \PDO;
use App\Security\Password;
use App\Security\IPDetection;
use Interop\Container\ContainerInterface;
use Slim\Http\Request;
use Slim\Http\Response;

class Home {

	/**
     * @var ContainerInterface
     */
    protected $container;

    /**
     * @var Response
     */
    protected $response;

    /**
     * Home constructor.
     * @param ContainerInterface $ci
     */
    public function __construct(ContainerInterface $container) {
    	$this->container = $container;
    }

    protected function getCurrentIpWithLong() {
        return ip2long(IPDetection::fetchIP());
    }

    protected function storeAdministrator($administrator) {
        $this->container->session->set('admin', md5($this->getCurrentIpWithLong()) . $_SERVER['HTTP_USER_AGENT']);
        $this->container->session->set('email', $administrator['email']);
        $this->container->session->set('username', $administrator['username']);
    }

    /**
     * @return ContainerInterface
     */
    public function getContainer() {
        return $this->container;
    }

    public function responseNormalStatus($result) {
        return $this->response->withJson($result, 200);
    }

    public function isUserAdmin(Request $request, Response $response) {
        $this->response = $response;

        if (isset($this->container->session->admin) && 
            $this->container->session['admin'] === md5($this->getCurrentIpWithLong()).$_SERVER['HTTP_USER_AGENT']) {
            return $this->responseNormalStatus(['success' => true, 'username' => $this->container->session->username]);
        }

        return $this->responseNormalStatus(['success' => false]);
    }

    public function login(Request $request, Response $response) { 
        $this->response = $response;
        $user = json_decode($request->getBody(), JSON_OBJECT_AS_ARRAY);

        $stmt = $this->container->pdo->prepare('SELECT id, username, password FROM member WHERE email = :email AND status = :authority');
        $stmt->execute([':email' => $user['email'], ':authority' => 'A']);

        if (!$stmt->rowCount() > 0) {
            return $this->responseNormalStatus(['success' => false, 'message' => 'Email ERROR']);
        }

        $administrator = $stmt->fetch(PDO::FETCH_ASSOC);
        $administrator['email'] = $user['email'];

        if (!Password::checkPassword($administrator['password'], $user['password'])) {
            return $this->responseNormalStatus(['success' => false, 'message' => 'Password ERROR']);
        }

        $this->storeAdministrator($administrator);
        return $this->responseNormalStatus(['success' => true]);
    }

    public function logout(Request $request, Response $response) {
        $this->response = $response;

        $this->container->session->clear();
        $this->container->session->destroy();
        $this->container->session->regenerateId();

        return $this->responseNormalStatus(['success' => true]);
    }

}