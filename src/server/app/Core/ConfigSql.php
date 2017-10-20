<?php

namespace Application;

interface ConfigSql {
	
	const SEARCH_ACCOUNT = 'SELECT id, username, password FROM member WHERE email = :email AND status = :authority';

	const SEARCH_ALL_MEMBER = 'SELECT id, username, email FROM member WHERE status = :memberStatus';

	const SEARCH_MEMBER_DETAIL = 'SELECT username, phone, email, sex FROM member WHERE status = :memberStatus AND id = :memberId';

	const SEARCH_PRODUCT_MENU = 'SELECT * FROM product ORDER BY id ASC';

	const SEARCH_PRODUCT = 'SELECT name, price FROM product WHERE id = :productId';

	// TO_CHAR((NOW() - INTERVAL :dateLimit

	const SEARCH_TODAY_ORDER = "SELECT t.id, t.name AS username, t.address, t.phone, email, list, bankaccount, d.name AS deliver, d.fee, totalprice, t.message, status, userid, updatedate FROM transaction AS t INNER JOIN deliver AS d ON t.deliverid = d.id AND SUBSTR(cast (updatedate as text), :updateStart, :updateEnd) = TO_CHAR((NOW()), :dateFormat) AND status = :status";
	
	const SEARCH_ORDER_BY_CUSTOMER = 'SELECT t.id, t.name AS username, t.address, t.phone, email, list, bankaccount, d.name AS deliver, d.fee, totalprice, t.message, status, userid, updatedate FROM transaction AS t INNER JOIN deliver AS d ON t.deliverid = d.id AND t.name LIKE ? ';

	const SEARCH_ORDER_BY_DATE = 'SELECT t.id, t.name AS username, t.address, t.phone, email, list, bankaccount, d.name AS deliver, d.fee, totalprice, t.message, status, userid, updatedate FROM transaction AS t INNER JOIN deliver AS d ON t.deliverid = d.id AND LEFT(cast(updatedate as text), 8) BETWEEN ? AND ? ';

	const MANAGE_ORDER_STATUS = 'UPDATE transaction SET status = ? '; 


	const CREATE_ADMINISTRATOR = 'INSERT INTO member (username, email, password, phone, status, createdate) VALUES (:username, :email, :password, :phone, :status, :createdate)';

}
