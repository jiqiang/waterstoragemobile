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
    $row['storages'] = run(getStoragesSQL('state', $row['state']));
  }

  $cities = run(getCitiesSQL());
  foreach ($cities as &$row) {
    $row['storages'] = run(getStoragesSQL('city', $row['city']));
  }

  $drainages = run(getDrainagesSQL());
  foreach ($drainages as &$row) {
    $row['storages'] = run(getStoragesSQL('drainage', $row['drainage']));
  }

  $data = array(
    'national' => $national,
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

function getNationalSQL() {
  return $sql = "
    select
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
      t1.state,
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
    ) t2 on t1.state = t2.group_name
  ";
}

function getCitiesSQL() {
  return $sql = "
    select
      t1.city,
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
    ) t2 on t1.city = t2.group_name
  ";
}

function getDrainagesSQL() {
  return $sql = "
    select
      t1.drainage,
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
    ) t2 on t1.drainage = t2.group_name
  ";
}

function getStoragesSQL($by_what, $value) {
  return $sql = "
    select
      t1.storage_name as storage,
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
      where " . $by_what . " = '" . $value . "'
      group by storage_name, today
      order by storage_name
    ) t1 left join (
      select
        storage_name,
        round(change_since_yesterday * 100, 2) as percentage_change_since_yesterday,
        round(today_volume_active - yestrday_volume_active, 2) as volume_change_since_yesterday,
        round(change_since_last_week * 100, 2) as percentage_change_since_last_week,
        round(today_volume_active - last_wk_volume_active, 2) as volume_change_since_last_week,
        round(change_since_last_month * 100, 2) as percentage_change_since_last_month,
        round(today_volume_active - lst_mth_volume_active, 2) as volume_change_since_last_month,
        round(change_since_last_year * 100, 2) as percentage_change_since_last_year,
        round(today_volume_active - lst_yr_volume_active, 2) as volume_change_since_last_year
      from wid_schema.tblu_storage_view
    ) t2 on t1.storage_name = t2.storage_name
  ";
}

function run($sql) {
  global $conn;

  $data = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
  return $data;
}
