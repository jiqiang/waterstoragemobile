<?php

interface Env {

    const ENV_FILE = "include/env-current.php";
    const ENV_DEV_FILE = "env/env-dev.php";
    const ENV_LOCAL_FILE = "env/env-local.php";

    public function getTableauServerURL();
}
