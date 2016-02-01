<?php

/**
 * Internal production environment
 */
class EnvCurrent implements Env {

    const URL = "http://iss-bi-prod.bom.gov.au";

    public function getTableauServerURL() {
        return self::URL;
    }
}

?>
