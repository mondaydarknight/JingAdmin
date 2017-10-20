<?php

namespace App\Controller;

use PDO;
use App\Core\Time;
use App\Core\Transfer;
use Interop\Container\ContainerInterface;
use Slim\Http\Request;
use Slim\Http\Response;

class Order {
 	
    /**
     * @var ContainerInterface
     */
    protected $container;

    /**
     * @var Response
     */
    protected $response;

    /**
     * @var Order Storage
     */
    protected $orders = [];
   
    /**
     * @var Order Storage
     */
    protected $manageOrderStatus = [
        'completeOrder' => 'C',
        'cancelOrder' => 'D'
    ];

    /**
     * Home constructor.
     * @param ContainerInterface $ci
     */
    public function __construct(ContainerInterface $container) {
    	$this->container = $container;
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

    protected function fetchProductProcess($stmt) {
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $key => $order) {
            $listPieces = explode('|', $order['list']);
            $list = $this->orderListLinkProduct($listPieces);

            $this->storeOrdersTransform($order, $list);
        }

        return $this->responseNormalStatus(['success' => true, 'orders' => $this->orders]);
    }

    protected function orderListLinkProduct($listPieces) {
        $list = [];

        foreach ($listPieces as $key => $singleList) {
            $part = explode('-', $singleList);

            $stmt = $this->container->pdo->prepare('SELECT name, price FROM product WHERE id = :productId');
            $stmt->execute([':productId' => $part[0]]);
            $stmt->rowCount() ? $list[] = $stmt->fetch(PDO::FETCH_ASSOC)['name'].'x'.$part[1] : null;
        }

        return $list;
    }

    protected function storeOrdersTransform($order, $list) {
        $this->orders[] = [
            'transactionId' => $order['id'],
            'username'      => $order['username'],
            'address'       => $order['address'],
            'phone'         => $order['phone'],
            'email'         => $order['email'],
            'price'         => $order['totalprice'],
            'status'        => $order['status'],
            'lists'         => $list,
            'fee'           => $order['fee'],
            'deliver'       => $order['deliver'],
            'bankAccount'   => $order['bankaccount'],
            'message'       => $order['message'],
            'userId'        => $order['userid'],
            'updatedate'    => Time::transferOnlyMonth($order['updatedate'])
        ];
    }

    public function searchTodayOrder(Request $request, Response $response) {
    	$this->response = $response;

        $sql = "SELECT t.id, t.name AS username, t.address, t.phone, email, list, bankaccount, d.name AS deliver, d.fee, totalprice, t.message, status, userid, updatedate FROM transaction AS t INNER JOIN deliver AS d ON t.deliverid = d.id AND SUBSTR(cast (updatedate as text), :updateStart, :updateEnd) = TO_CHAR((NOW()), :dateFormat) AND status = :status";

    	$factor = [':updateStart' => 0, ':updateEnd' => 9, ':dateFormat' => 'YYYYMMDD', ':status' => ' '];

        $stmt = $this->container->pdo->prepare($sql);
        $stmt->execute($factor);

        if (!$stmt->rowCount()) {
            return $this->responseNormalStatus(['success' => false]);
        }

        return $this->fetchProductProcess($stmt);
    }

    public function searchOrderByCustomer(Request $request, Response $response) {
        $this->response = $response;
        $params = $request->getQueryParams();

        $sql = 'SELECT t.id, t.name AS username, t.address, t.phone, email, list, bankaccount, d.name AS deliver, d.fee, totalprice, t.message, status, userid, updatedate FROM transaction AS t INNER JOIN deliver AS d ON t.deliverid = d.id AND t.name LIKE ? ';

        $statusAmount = str_repeat('?,', count($params['orderStatus']) - 1) . '?';

        $stmt = $this->container->pdo->prepare($sql.'AND status IN ('.$statusAmount.') ORDER BY id DESC');
        $stmt->execute(array_merge(['%'.$params['customerId'].'%'], $params['orderStatus']));

        if (!$stmt->rowCount() > 0) {
            return $this->responseNormalStatus(['success' => false]);
        } 

        return $this->fetchProductProcess($stmt);
    }

    public function searchOrderByDate(Request $request, Response $response) {
        $this->response = $response;
        $params = $request->getQueryParams();

        $sql = 'SELECT t.id, t.name AS username, t.address, t.phone, email, list, bankaccount, d.name AS deliver, d.fee, totalprice, t.message, status, userid, updatedate FROM transaction AS t INNER JOIN deliver AS d ON t.deliverid = d.id AND LEFT(cast(updatedate as text), 8) BETWEEN ? AND ? ';

        $statusAmount = str_repeat('?,', count($params['orderStatus']) - 1) . '?';

        $stmt = $this->container->pdo->prepare($sql.'AND status IN ('.$statusAmount.') ORDER BY id DESC');
        $stmt->execute(array_merge([$params['dateFrom'], $params['dateEnd']], $params['orderStatus']));

        if (!$stmt->rowCount() > 0) {
            return $this->responseNormalStatus(['success' => false]);
        } 

        return $this->fetchProductProcess($stmt);
    }

    public function manageOrder(Request $request, Response $response) {
        $this->response = $response;
        $params = json_decode($request->getBody(), JSON_OBJECT_AS_ARRAY);

        $orderStatus = $this->manageOrderStatus[$params['command']];
        $manageAmount = Transfer::countArrayAmount($params['transactionIds']);

        $sql = 'UPDATE transaction SET status = ?'.' WHERE id IN ('.$manageAmount.')';

        $stmt = $this->container->pdo->prepare($sql);
        $stmt->execute(array_merge([$orderStatus], $params['transactionIds']));
        
        if (!$stmt->rowCount() > 0) {
            return $this->responseNormalStatus(['success' => false]);
        }

        return $this->responseNormalStatus(['success' => true, 'status' => $orderStatus]);
    }   



}
