<?php

namespace Application;

class Session {

    private $sessionName;
    
    public function __construct($isReGenerate=false, $sessionName=null, $sessionId=null) {
        
        if (!is_null($sessionId)) {
            session_id($sessionId);
        }

        session_start();

        if ($isReGenerate) {
            $this->regenerateSession(true);
        }

        if (!is_null($sessionName)) {
            $this->sessionName = session_name($sessionName);
        }
    }
    
    public function set($key, $val) {
        $_SESSION[$key] = $val;
    }
    
    /*
        to set something like $_SESSION['key1']['key2']['key3']:
        $session->setMd(array('key1', 'key2', 'key3'), 'value')
    */
    public function setMd($keyArray, $val) {
        $arrStr = "['".implode("']['", $keyArray)."']";
        $_SESSION{$arrStr} = $val;
    }
    
    
    public function get($key) {
        return (isset($_SESSION[$key])) ? $_SESSION[$key] : false;
    }
    
    /*
        to get something like $_SESSION['key1']['key2']['key3']:
        $session->getMd(array('key1', 'key2', 'key3'))
    */
    public function getMd($keyArray) {
        $arrStr = "['".implode("']['", $keyArray)."']";
        return (isset($_SESSION{$arrStr})) ? $_SESSION{$arrStr} : false;
    }
    
    public function delete($key) {
        if (isset($_SESSION[$key])) {
            unset($_SESSION[$key]);
            return true;
        }
        return false;
    }
    
    
    public function deleteMd($keyArray) {
        $arrStr = "['".implode("']['", $keyArray)."']";
        if (isset($_SESSION{$arrStr})) {
            unset($_SESSION{$arrStr});
            return true;
        }
        return false;
    }
    
    // set cookie 
    // $_SESSION['token'] = sha1(time() . rand() . $_SERVER['SERVER_NAME']);
    // setcookie('token', $_SESSION['token']);
    
    public function regenerateSession($destroyOldSession=false) {
        session_regenerate_id(false);
        
        if ($destroyOldSession) {
            //  hang on to the new session id and name
            $sid = session_id();
            //  close the old and new sessions
            session_write_close();
            //  re-open the new session
            session_id($sid);
            session_start();
        }
    }
    
    public function destroy() {
        $_SESSION = array();
        session_unset();
        session_destroy();
        session_write_close();
        session_start();
    }
    
    
    public function getName()
    {
        return $this->sessionName;
    }

}


