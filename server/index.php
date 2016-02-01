<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);

include_once 'include/env.php';

//By default no evn file will exist.  Jenkins will copy and rename the file during deployment
//For a a local development run the Development environment will be used by default.
if (file_exists(ENV::ENV_FILE)) {
    include_once ENV::ENV_FILE;
} else {
    include_once ENV::ENV_LOCAL_FILE;
}

$env = new EnvCurrent();

$cds = $env->getDbConnCredentials();

$dsn = "pgsql:host=".$cds['server'].";port=".$cds['port'].";dbname=".$cds['database_name'];

$conn = null;

try {
  $conn = new PDO($dsn, $cds['username'], $cds['password']);

  $sql = "
    select
      state,
      city,
      drainage,
      storage_name as storage,
      today_volume_active as volume,
      today_capacity_active as capacity
    from
      wid_schema.tblu_storage_view
  ";

  $data = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
  foreach ($data as &$row) {
    $row['volume'] = round(floatval($row['volume']), 2);
    $row['capacity'] = round(floatval($row['capacity']), 2);
  }
  echo json_encode($data);
}
catch (PDOException $e) {
  echo $e->getMessage();
  exit(1);
}
