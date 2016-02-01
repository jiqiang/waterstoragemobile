<?php

/**
 * Tableau Public Environment
 */
class EnvCurrent implements Env {

    const URL = "https://public.tableau.com";

    public function getTableauServerURL() {
        return self::URL;
    }
}

?>
