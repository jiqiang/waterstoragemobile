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

  $national = run(getNationalSQL());

  $states = run(getStatesSQL());
  foreach ($states as &$row) {
    $row['cityandsystem'] = run(getCityAndSystemSQL('state', $row['title']));
    foreach ($row['cityandsystem'] as &$row1) {
      $row1['storages'] = run(getStoragesSQL(array(
        "state = '" . $row['title'] . "'",
        "(city = '".$row1['title']."' or rural_system = '".$row1['title']."')",
      )));
    }
    $row['storages'] = run(getStoragesSQL(array("state = '" . $row['title'] . "'")));
  }

  $cities = run(getCitiesSQL());
  foreach ($cities as &$row) {
    $row['storages'] = run(getStoragesSQL(array("city ='" . $row['title'] . "'")));
  }

  $drainages = run(getDrainagesSQL());
  foreach ($drainages as &$row) {
    $row['cityandsystem'] = run(getCityAndSystemSQL('drainage', $row['title']));
    foreach ($row['cityandsystem'] as &$row1) {
      $row1['storages'] = run(getStoragesSQL(array(
        "drainage = '" . $row['title'] . "'",
        "(city = '".$row1['title']."' or rural_system = '".$row1['title']."')",
      )));
    }
    $row['storages'] = run(getStoragesSQL(array("drainage = '" . $row['title'] ."'")));
  }

  $data = array(
    'national' => $national,
    'states' => $states,
    'cities' => $cities,
    'drainages' => $drainages,
    'chart' => getAll(),
  );

  header("Access-Control-Allow-Origin: *");
  header('Content-Type: application/json');
  echo json_encode($data);

 //echo "<pre>";
 //print_r($data);
}
catch (PDOException $e) {
  echo $e->getMessage();
  exit(1);
}

function getNationalSQL() {
  return $sql = "
    select
      t1.today_volume_active_total,
      'National'::text as subtype,
      t1.today_capacity_active_total,
      t1.percentage_full_today,
      t1.today,
      t2.percentage_change_since_yesterday,
      t2.volume_change_since_yesterday,
      t2.percentage_change_since_last_week,
      t2.volume_change_since_last_week,
      t2.percentage_change_since_last_month,
      t2.volume_change_since_last_month,
      t2.percentage_change_since_last_year,
      t2.volume_change_since_last_year
    from (
      select
        'National'::text as national,
        round(sum(today_volume_active), 2) as today_volume_active_total,
        round(sum(today_capacity_active), 2) as today_capacity_active_total,
        round(sum(today_volume_active) / sum(today_capacity_active) * 100, 2) as percentage_full_today,
        to_char(today_day, 'DY DD MON YYYY') as today
      from wid_schema.tblu_storage_view
      group by today_day) t1 left join (
        select
          'National'::text as national,
          round(change_since_yesterday * 100, 2) as percentage_change_since_yesterday,
          round(today_volume_active - ystrday_volume_active, 2) as volume_change_since_yesterday,
          round(change_since_last_week * 100, 2) as percentage_change_since_last_week,
          round(today_volume_active - lst_wk_volume_active, 2) as volume_change_since_last_week,
          round(change_since_last_month * 100, 2) as percentage_change_since_last_month,
          round(today_volume_active - lst_mth_volume_active, 2) as volume_change_since_last_month,
          round(change_since_last_year * 100, 2) as percentage_change_since_last_year,
          round(today_volume_active - lst_yr_volume_active, 2) as volume_change_since_last_year
        from wid_schema.tblu_storage_agg_all
        where group_level = 'National'
      ) t2 on t1.national = t2.national
  ";
}

function getStatesSQL() {
  return $sql = "
    select
      t1.state as title,
      'State_Territory'::text as subtype,
      t1.today_volume_active_total,
      t1.today_capacity_active_total,
      t1.percentage_full_today,
      t1.today,
      t2.percentage_change_since_yesterday,
      t2.volume_change_since_yesterday,
      t2.percentage_change_since_last_week,
      t2.volume_change_since_last_week,
      t2.percentage_change_since_last_month,
      t2.volume_change_since_last_month,
      t2.percentage_change_since_last_year,
      t2.volume_change_since_last_year
    from (
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
    ) t1 left join (
      select
        group_name,
        round(change_since_yesterday * 100, 2) as percentage_change_since_yesterday,
        round(today_volume_active - ystrday_volume_active, 2) as volume_change_since_yesterday,
        round(change_since_last_week * 100, 2) as percentage_change_since_last_week,
        round(today_volume_active - lst_wk_volume_active, 2) as volume_change_since_last_week,
        round(change_since_last_month * 100, 2) as percentage_change_since_last_month,
        round(today_volume_active - lst_mth_volume_active, 2) as volume_change_since_last_month,
        round(change_since_last_year * 100, 2) as percentage_change_since_last_year,
        round(today_volume_active - lst_yr_volume_active, 2) as volume_change_since_last_year
      from wid_schema.tblu_storage_agg_all
      where group_level = 'State_Territory'
    ) t2 on t1.state = t2.group_name order by t1.today_capacity_active_total desc
  ";
}

function getCitiesSQL() {
  return $sql = "
    select
      t1.city as title,
      'Urban_System'::text as subtype,
      t1.today_volume_active_total,
      t1.today_capacity_active_total,
      t1.percentage_full_today,
      t1.today,
      t2.percentage_change_since_yesterday,
      t2.volume_change_since_yesterday,
      t2.percentage_change_since_last_week,
      t2.volume_change_since_last_week,
      t2.percentage_change_since_last_month,
      t2.volume_change_since_last_month,
      t2.percentage_change_since_last_year,
      t2.volume_change_since_last_year
    from (
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
    ) t1 left join (
      select
        group_name,
        round(change_since_yesterday * 100, 2) as percentage_change_since_yesterday,
        round(today_volume_active - ystrday_volume_active, 2) as volume_change_since_yesterday,
        round(change_since_last_week * 100, 2) as percentage_change_since_last_week,
        round(today_volume_active - lst_wk_volume_active, 2) as volume_change_since_last_week,
        round(change_since_last_month * 100, 2) as percentage_change_since_last_month,
        round(today_volume_active - lst_mth_volume_active, 2) as volume_change_since_last_month,
        round(change_since_last_year * 100, 2) as percentage_change_since_last_year,
        round(today_volume_active - lst_yr_volume_active, 2) as volume_change_since_last_year
      from wid_schema.tblu_storage_agg_all
      where group_level = 'Urban_System'
    ) t2 on t1.city = t2.group_name order by t1.today_capacity_active_total desc
  ";
}

function getDrainagesSQL() {
  return $sql = "
    select
      t1.drainage as title,
      'UWDB DRAINAGE DIV'::text as subtype,
      t1.today_volume_active_total,
      t1.today_capacity_active_total,
      t1.percentage_full_today,
      t1.today,
      t2.percentage_change_since_yesterday,
      t2.volume_change_since_yesterday,
      t2.percentage_change_since_last_week,
      t2.volume_change_since_last_week,
      t2.percentage_change_since_last_month,
      t2.volume_change_since_last_month,
      t2.percentage_change_since_last_year,
      t2.volume_change_since_last_year
    from (
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
    ) t1 left join (
      select
        group_name,
        round(change_since_yesterday * 100, 2) as percentage_change_since_yesterday,
        round(today_volume_active - ystrday_volume_active, 2) as volume_change_since_yesterday,
        round(change_since_last_week * 100, 2) as percentage_change_since_last_week,
        round(today_volume_active - lst_wk_volume_active, 2) as volume_change_since_last_week,
        round(change_since_last_month * 100, 2) as percentage_change_since_last_month,
        round(today_volume_active - lst_mth_volume_active, 2) as volume_change_since_last_month,
        round(change_since_last_year * 100, 2) as percentage_change_since_last_year,
        round(today_volume_active - lst_yr_volume_active, 2) as volume_change_since_last_year
      from wid_schema.tblu_storage_agg_all
      where group_level = 'UWDB DRAINAGE DIV'
    ) t2 on t1.drainage = t2.group_name order by t1.today_capacity_active_total desc
  ";
}

function getStoragesSQL($filters) {
  return $sql = "
    select
      t1.storage_name as title,
      'storages'::text as subtype,
      t1.today_volume_active_total,
      t1.today_capacity_active_total,
      t1.percentage_full_today,
      t1.today,
      t2.percentage_change_since_yesterday,
      t2.volume_change_since_yesterday,
      t2.percentage_change_since_last_week,
      t2.volume_change_since_last_week,
      t2.percentage_change_since_last_month,
      t2.volume_change_since_last_month,
      t2.percentage_change_since_last_year,
      t2.volume_change_since_last_year
    from (
      select
        storage_name,
        round(sum(today_volume_active), 2) as today_volume_active_total,
        round(sum(today_capacity_active), 2) as today_capacity_active_total,
        round(sum(today_volume_active) / sum(today_capacity_active) * 100, 2) as percentage_full_today,
        to_char(today_day, 'DY DD MON YYYY') as today
      from wid_schema.tblu_storage_view
      where " . implode(" and ", $filters) . "
      group by storage_name, today
      order by storage_name
    ) t1 left join (
      select
        storage_name,
        round(change_since_yesterday * 100, 2) as percentage_change_since_yesterday,
        round(today_volume_active - ystrday_volume_active, 2) as volume_change_since_yesterday,
        round(change_since_last_week * 100, 2) as percentage_change_since_last_week,
        round(today_volume_active - last_wk_volume_active, 2) as volume_change_since_last_week,
        round(change_since_last_month * 100, 2) as percentage_change_since_last_month,
        round(today_volume_active - lst_mth_volume_active, 2) as volume_change_since_last_month,
        round(change_since_last_year * 100, 2) as percentage_change_since_last_year,
        round(today_volume_active - lst_yr_volume_active, 2) as volume_change_since_last_year
      from wid_schema.tblu_storage_view
    ) t2 on t1.storage_name = t2.storage_name order by t1.today_capacity_active_total desc
  ";
}

function getCityAndSystemSQL($filterBy, $filterByValue) {
  return $sql = "
    ((select
      t1.city as title,
      'Urban_System'::text as subtype,
      t1.today_volume_active_total,
      t1.today_capacity_active_total,
      t1.percentage_full_today,
      t1.today,
      t2.percentage_change_since_yesterday,
      t2.volume_change_since_yesterday,
      t2.percentage_change_since_last_week,
      t2.volume_change_since_last_week,
      t2.percentage_change_since_last_month,
      t2.volume_change_since_last_month,
      t2.percentage_change_since_last_year,
      t2.volume_change_since_last_year
    from (
      select
        city,
        round(sum(today_volume_active), 2) as today_volume_active_total,
        round(sum(today_capacity_active), 2) as today_capacity_active_total,
        round(sum(today_volume_active) / sum(today_capacity_active) * 100, 2) as percentage_full_today,
        to_char(today_day, 'DY DD MON YYYY') as today
      from wid_schema.tblu_storage_view
      where city != '' and " . $filterBy . " = '" . $filterByValue . "'
      group by city, today
    ) t1 left join (
      select
        group_name,
        round(change_since_yesterday * 100, 2) as percentage_change_since_yesterday,
        round(today_volume_active - ystrday_volume_active, 2) as volume_change_since_yesterday,
        round(change_since_last_week * 100, 2) as percentage_change_since_last_week,
        round(today_volume_active - lst_wk_volume_active, 2) as volume_change_since_last_week,
        round(change_since_last_month * 100, 2) as percentage_change_since_last_month,
        round(today_volume_active - lst_mth_volume_active, 2) as volume_change_since_last_month,
        round(change_since_last_year * 100, 2) as percentage_change_since_last_year,
        round(today_volume_active - lst_yr_volume_active, 2) as volume_change_since_last_year
      from wid_schema.tblu_storage_agg_all
      where group_level = 'Urban_System'
    ) t2 on t1.city = t2.group_name)

    union

    (select
      t1.rural_system as title,
      'Rural_System'::text as subtype,
      t1.today_volume_active_total,
      t1.today_capacity_active_total,
      t1.percentage_full_today,
      t1.today,
      t2.percentage_change_since_yesterday,
      t2.volume_change_since_yesterday,
      t2.percentage_change_since_last_week,
      t2.volume_change_since_last_week,
      t2.percentage_change_since_last_month,
      t2.volume_change_since_last_month,
      t2.percentage_change_since_last_year,
      t2.volume_change_since_last_year
    from (
      select
        rural_system,
        round(sum(today_volume_active), 2) as today_volume_active_total,
        round(sum(today_capacity_active), 2) as today_capacity_active_total,
        round(sum(today_volume_active) / sum(today_capacity_active) * 100, 2) as percentage_full_today,
        to_char(today_day, 'DY DD MON YYYY') as today
      from wid_schema.tblu_storage_view
      where rural_system != '' and " . $filterBy . " = '" . $filterByValue . "'
      group by rural_system, today
    ) t1 left join (
      select
        group_name,
        round(change_since_yesterday * 100, 2) as percentage_change_since_yesterday,
        round(today_volume_active - ystrday_volume_active, 2) as volume_change_since_yesterday,
        round(change_since_last_week * 100, 2) as percentage_change_since_last_week,
        round(today_volume_active - lst_wk_volume_active, 2) as volume_change_since_last_week,
        round(change_since_last_month * 100, 2) as percentage_change_since_last_month,
        round(today_volume_active - lst_mth_volume_active, 2) as volume_change_since_last_month,
        round(change_since_last_year * 100, 2) as percentage_change_since_last_year,
        round(today_volume_active - lst_yr_volume_active, 2) as volume_change_since_last_year
      from wid_schema.tblu_storage_agg_all
      where group_level = 'Rural_System'
    ) t2 on t1.rural_system = t2.group_name)) order by today_capacity_active_total desc
  ";
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

function getChartProportionFullData($groupType, $groupValue, $month_array) {

  $sql = "
    select
      round(sum(volume_active) / sum(capacity_active) * 100, 2) as proportion_full,
      to_char(observation_date, 'YYYY.MM') as observation_mon_str
    from wid_schema.tblu_storage_agg_timeseries
    where to_char(observation_date, 'YYYY.MM') in ('" . implode("','", $month_array) . "') and group_type_code = '" . $groupType . "' and group_name = '" . $groupValue . "'
    group by observation_mon_str order by observation_mon_str asc
  ";

  if ($groupType === 'storages') {
    $sql = "
      select
        round(sum(volume_active) / sum(capacity_active) * 100, 2) as proportion_full,
        to_char(observation_day, 'YYYY.MM') as observation_mon_str
      from wid_schema.tblu_storage_timeseries
      where to_char(observation_day, 'YYYY.MM') in ('" . implode("','", $month_array) . "') and storage_name = '" . $groupValue . "'
      group by observation_mon_str order by observation_mon_str asc
    ";
  }

  global $conn;

  $result = $conn->query($sql);
  if (!$result) {
    var_dump($sql);
  }
  $data = $result->fetchAll(PDO::FETCH_ASSOC);

  foreach ($data as $row) {
    if (false !== ($key = array_search($row['observation_mon_str'], $month_array))) {
      $month_array[$key] = floatval($row['proportion_full']);
    }
  }

  foreach ($month_array as &$d) {
    if (is_string($d)) {
      $d = null;
    }
  }

  return $month_array;
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

  $month_array = getTimeseries();
  $data = array();

  $categories = getCategories();
  foreach ($categories as $cat) {
    $data[$cat['grouptype']][$cat['groupvalue']] = getChartProportionFullData(pg_escape_string($cat['grouptype']), pg_escape_string($cat['groupvalue']), $month_array);
  }
  $data['timeseries'] = $month_array;
  return $data;
}

function getTimeseries() {
  $month_array = array();
  for ($i = -18; $i <= -1; $i++) {
    $month_array[] = date('Y.m', strtotime(date('Y-m')." ".$i." month"));
  }
  return $month_array;
}

function run($sql) {
  global $conn;

  $result = $conn->query($sql);
  $data = $result->fetchAll(PDO::FETCH_ASSOC);

  foreach ($data as &$row) {
    $row['today_volume_active_total'] = number_format(floatval($row['today_volume_active_total']), 2, '.', ',');
    $row['today_capacity_active_total'] = number_format(floatval($row['today_capacity_active_total']), 2, '.', ',');

    $row['volume_change_since_yesterday'] = number_format(floatval($row['volume_change_since_yesterday']), 2, '.', ',');
    if (false === strpos($row['volume_change_since_yesterday'], '-') && floatval($row['volume_change_since_yesterday']) !== 0.00) {
      $row['volume_change_since_yesterday'] = '+' . $row['volume_change_since_yesterday'];
    }

    $row['volume_change_since_last_week'] = number_format(floatval($row['volume_change_since_last_week']), 2, '.', ',');
    if (false === strpos($row['volume_change_since_last_week'], '-')  && floatval($row['volume_change_since_last_week']) !== 0.00) {
      $row['volume_change_since_last_week'] = '+' . $row['volume_change_since_last_week'];
    }

    $row['volume_change_since_last_month'] = number_format(floatval($row['volume_change_since_last_month']), 2, '.', ',');
    if (false === strpos($row['volume_change_since_last_month'], '-')  && floatval($row['volume_change_since_last_month']) !== 0.00) {
      $row['volume_change_since_last_month'] = '+' . $row['volume_change_since_last_month'];
    }

    $row['volume_change_since_last_year'] = number_format(floatval($row['volume_change_since_last_year']), 2, '.', ',');
    if (false === strpos($row['volume_change_since_last_year'], '-')  && floatval($row['volume_change_since_last_year']) !== 0.00) {
      $row['volume_change_since_last_year'] = '+' . $row['volume_change_since_last_year'];
    }

    if (false === strpos($row['percentage_change_since_yesterday'], '-') && floatval($row['percentage_change_since_yesterday']) !== 0.00) {
      $row['percentage_change_since_yesterday'] = '+' . $row['percentage_change_since_yesterday'];
    }

    if (false === strpos($row['percentage_change_since_last_week'], '-')  && floatval($row['percentage_change_since_last_week']) !== 0.00) {
      $row['percentage_change_since_last_week'] = '+' . $row['percentage_change_since_last_week'];
    }

    if (false === strpos($row['percentage_change_since_last_month'], '-')  && floatval($row['percentage_change_since_last_month']) !== 0.00) {
      $row['percentage_change_since_last_month'] = '+' . $row['percentage_change_since_last_month'];
    }

    if (false === strpos($row['percentage_change_since_last_year'], '-')  && floatval($row['percentage_change_since_last_year']) !== 0.00) {
      $row['percentage_change_since_last_year'] = '+' . $row['percentage_change_since_last_year'];
    }

  }

  return $data;
}
