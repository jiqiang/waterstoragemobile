<?php

/**
 * Local Environment
 */
class EnvCurrent implements Env {

    const URL = "http://iss-bi-dev.bom.gov.au";
    const TEMP_DIRECTORY = "downloads";

    public function getTableauServerURL() {
        return self::URL;
    }

    /**
     * Define database connection credentials.
     *
     * @return array
     *     An array contains database connection credentials.
     */
    public function getDbConnCredentials()
    {
        return array(
            'database_type' => 'pgsql',
            'server' => 'localhost',
            'database_name' => 'wid',
            'username' => 'wid_owner',
            'password' => 'widowner',
            'charset' => 'utf8',
            'port' => 5432,
            'prefix' => 'wid_schema.',
        );
    }
}
