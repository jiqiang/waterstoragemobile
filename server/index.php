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

  $states = getStatesData();
  foreach ($states as &$row) {
    $row['storages'] = getStorages('state', $row['state']);
  }

  $cities = getCitiesData();
  foreach ($cities as &$row) {
    $row['storages'] = getStorages('city', $row['city']);
  }

  $drainages = getDrainagesData();
  foreach ($drainages as &$row) {
    $row['storages'] = getStorages('drainage', $row['drainage']);
  }

  $data = array(
    'states' => $states,
    'cities' => $cities,
    'drainages' => $drainages,
  );

  echo json_encode($data);
}
catch (PDOException $e) {
  echo $e->getMessage();
  exit(1);
}

function getStatesData() {
  global $conn;

  $sql = "
    select
      state,
      round(sum(today_volume_active), 2) as today_volume_active_total,
      round(sum(today_capacity_active), 2) as today_capacity_active_total,
      round(sum(today_volume_active) / sum(today_capacity_active) * 100, 2) as percentage_full_today,
      to_char(today_day, 'DY DD MON YYYY') as today
    from wid_schema.tblu_storage_view
    where state != ''
    group by state, today
    order by state
  ";
  $data = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
  foreach ($data as &$row) {
    $row['today_volume_active_total'] = floatval($row['today_volume_active_total']);
    $row['today_capacity_active_total'] = floatval($row['today_capacity_active_total']);
  }
  return $data;
}

function getCitiesData() {
  global $conn;

  $sql = "
    select
      city,
      round(sum(today_volume_active), 2) as today_volume_active_total,
      round(sum(today_capacity_active), 2) as today_capacity_active_total,
      round(sum(today_volume_active) / sum(today_capacity_active) * 100, 2) as percentage_full_today,
      to_char(today_day, 'DY DD MON YYYY') as today
    from wid_schema.tblu_storage_view
    where city != ''
    group by city, today
    order by city
  ";
  $data = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
  foreach ($data as &$row) {
    $row['today_volume_active_total'] = floatval($row['today_volume_active_total']);
    $row['today_capacity_active_total'] = floatval($row['today_capacity_active_total']);
  }
  return $data;
}

function getDrainagesData() {
  global $conn;

  $sql = "
    select
      drainage,
      round(sum(today_volume_active), 2) as today_volume_active_total,
      round(sum(today_capacity_active), 2) as today_capacity_active_total,
      round(sum(today_volume_active) / sum(today_capacity_active) * 100, 2) as percentage_full_today,
      to_char(today_day, 'DY DD MON YYYY') as today
    from wid_schema.tblu_storage_view
    where drainage != ''
    group by drainage, today
    order by drainage
  ";
  $data = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
  foreach ($data as &$row) {
    $row['today_volume_active_total'] = floatval($row['today_volume_active_total']);
    $row['today_capacity_active_total'] = floatval($row['today_capacity_active_total']);
  }
  return $data;
}

function getStorages($by_what, $value) {
  global $conn;
  $sql = "
    select
      storage_name as storage,
      round(sum(today_volume_active), 2) as today_volume_active_total,
      round(sum(today_capacity_active), 2) as today_capacity_active_total,
      round(sum(today_volume_active) / sum(today_capacity_active) * 100, 2) as percentage_full_today,
      to_char(today_day, 'DY DD MON YYYY') as today
    from wid_schema.tblu_storage_view
    where " . $by_what . " = '" . $value . "'
    group by storage_name, today
    order by storage_name
  ";
  $data = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
  foreach ($data as &$row) {
    $row['today_volume_active_total'] = floatval($row['today_volume_active_total']);
    $row['today_capacity_active_total'] = floatval($row['today_capacity_active_total']);
  }
  return $data;
}
