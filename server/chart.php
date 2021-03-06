<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);

date_default_timezone_set("Australia/Melbourne");

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

$current_year = date('Y');
$last_year = $current_year - 1;
$last_year_before = $current_year - 2;

try {
  $conn = new PDO($dsn, $cds['username'], $cds['password']);

  $data = array();

  if (isset($_GET['group_type']) && isset($_GET['group_value'])) {
    $groupType = pg_escape_string($_GET['group_type']);
    $groupValue = pg_escape_string($_GET['group_value']);

    if ($groupType === 'all' && $groupValue === 'all') {
      $data = getAll();
    }
    else {
      $data = array(
        $current_year => array(
          'capacity' => getChartTotalCapacityData($groupType, $groupValue, $current_year),
          'proportions' => getChartProportionFullData($groupType, $groupValue, $current_year),
        ),
        $last_year => array(
          'capacity' => getChartTotalCapacityData($groupType, $groupValue, $last_year),
          'proportions' => getChartProportionFullData($groupType, $groupValue, $last_year),
        ),
        $last_year_before => array(
          'capacity' => getChartTotalCapacityData($groupType, $groupValue, $last_year_before),
          'proportions' => getChartProportionFullData($groupType, $groupValue, $last_year_before),
        ),
      );
    }
  }

  //echo "<pre>";
  //print_r($data);
  header("Access-Control-Allow-Origin: *");
  header('Content-Type: application/json');
  echo json_encode($data);

} catch (PDOException $e) {
  echo $e->getMessage();
  exit(1);
}

function getChartTotalCapacityData($groupType, $groupValue, $year) {
  $sql = "
    select
      round(sum(capacity_active), 2) as capacity_active_total
    from wid_schema.tblu_storage_agg_timeseries
    where year = '" . $year . "' and group_type_code = '" . $groupType . "' and group_name = '" . $groupValue . "'
    group by group_name
  ";

  if ($groupType === 'storages') {
    $sql = "
      select
        round(sum(capacity_active), 2) as capacity_active_total
      from wid_schema.tblu_storage_timeseries
      where to_char(observation_day, 'YYYY') = '" . $year . "' and storage_name = '" . $groupValue . "'
      group by storage_name
    ";
  }

  global $conn;
  $capacity = "";

  $result = $conn->query($sql);
  if (!$result) {
    var_dump($sql);
  }
  $data = $result->fetchAll(PDO::FETCH_ASSOC);
  foreach ($data as $row) {
    $capacity = floatval($row['capacity_active_total']);
  }
  return $capacity;
}

function getChartProportionFullData($groupType, $groupValue, $year) {
  $sql = "
    select
      round(sum(volume_active) / sum(capacity_active) * 100, 2) as proportion_full,
      to_char(observation_date, 'MM') as observation_mon_num,
      to_char(observation_date, 'MON') as observation_mon_str
    from wid_schema.tblu_storage_agg_timeseries
    where year = '" . $year . "' and group_type_code = '" . $groupType . "' and group_name = '" . $groupValue . "'
    group by observation_mon_str, observation_mon_num order by observation_mon_num asc
  ";

  if ($groupType === 'storages') {
    $sql = "
      select
        round(sum(volume_active) / sum(capacity_active) * 100, 2) as proportion_full,
        to_char(observation_day, 'MM') as observation_mon_num,
        to_char(observation_day, 'MON') as observation_mon_str
      from wid_schema.tblu_storage_timeseries
      where to_char(observation_day, 'YYYY') = '" . $year . "' and storage_name = '" . $groupValue . "'
      group by observation_mon_str, observation_mon_num order by observation_mon_num asc
    ";
  }

  global $conn;
  $data_array = array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  $result = $conn->query($sql);
  if (!$result) {
    var_dump($sql);
  }
  $data = $result->fetchAll(PDO::FETCH_ASSOC);
  foreach ($data as $row) {
    $mon = intval($row['observation_mon_num']);
    $data_array[$mon] = floatval($row['proportion_full']);
  }
  array_shift($data_array);
  return $data_array;
}

function getCategories() {
  $sql = "
    (select distinct
      'storages'::text as grouptype,
      storage_name as groupvalue
    from wid_schema.tblu_storage_view)
    union
    (select distinct
      group_type_code as grouptype,
      group_name as groupvalue
    from wid_schema.tblu_storage_agg_timeseries
    where group_type_code in ('UWDB DRAINAGE DIV', 'Urban_System', 'Rural_System', 'State_Territory', 'National')
    order by group_type_code asc
    )
  ";
  global $conn;
  $data = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
  return $data;
}

function getAll() {

  $current_year = date('Y');
  $most_recent_three_years = array($current_year, $current_year - 1, $current_year - 2);

  $data = array();
  $categories = getCategories();
  foreach ($categories as $cat) {
    foreach ($most_recent_three_years as $year) {
      $data[] = array(
        'grouptype' => $cat['grouptype'],
        'groupvalue' => $cat['groupvalue'],
        'year' => $year,
        'capacity' => getChartTotalCapacityData(pg_escape_string($cat['grouptype']), pg_escape_string($cat['groupvalue']), $year),
        'proportion' => getChartProportionFullData(pg_escape_string($cat['grouptype']), pg_escape_string($cat['groupvalue']), $year),
      );
    }
  }
  return $data;
}
