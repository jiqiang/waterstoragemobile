-- water markets - allocations
drop table if exists wid_schema."tblu_alloc_trade_mdb" cascade;
create table wid_schema."tblu_alloc_trade_mdb"
(
    "id" bigserial primary key,
    "day" date not null,
    "week" date not null,
    "month_code" text,
    "season_code" text,
    "fy_code" text,
    "water_quantity_traded" numeric(16,3),
    "water_quantity_with_price" numeric,
    "net_price" numeric,
    "avg_price_per_unit" numeric(10,2),
    "region" text,
    "unit" text,
    "origin_state" text not null,
    "smdb_flag" numeric(1),
    "price_missing" text,
    "water_resource_type_local" text not null,
    "water_resource_type_national" text,
    "surface_ground_water_code" text
);

drop table if exists wid_schema."tblu_alloc_trade_national" cascade;
create table wid_schema."tblu_alloc_trade_national"
(
    "id" bigserial primary key,
    "day" date not null,
    "week" date not null,
    "month_code" text,
    "season_code" text,
    "fy_code" text,
    "water_quantity_traded" numeric(16,3),
    "water_quantity_with_price" numeric,
    "net_price" numeric,
    "avg_price_per_unit" numeric(10,2),
    "region" text,
    "unit" text,
    "origin_state" text not null,
    "smdb_flag" numeric(1),
    "price_missing" text,
    "water_resource_type_local" text not null,
    "water_resource_type_national" text,
    "surface_ground_water_code" text
);

drop table if exists wid_schema."tblu_alloc_trade_state" cascade;
create table wid_schema."tblu_alloc_trade_state"
(
    "id" bigserial primary key,
    "day" date not null,
    "week" date not null,
    "month_code" text,
    "season_code" text,
    "fy_code" text,
    "water_quantity_traded" numeric(16,3),
    "water_quantity_with_price" numeric,
    "net_price" numeric,
    "avg_price_per_unit" numeric(10,2),
    "region" text,
    "unit" text,
    "origin_state" text not null,
    "destination_state" text not null,
    "smdb_flag" numeric(1),
    "price_missing" text,
    "water_resource_type_local" text not null,
    "water_resource_type_national" text,
    "surface_ground_water_code" text
);

drop table if exists wid_schema."tblu_alloc_trade_trading_zone" cascade;
create table wid_schema."tblu_alloc_trade_trading_zone"
(
    "id" bigserial primary key,
    "day" date not null,
    "week" date not null,
    "month_code" text,
    "season_code" text,
    "fy_code" text,
    "water_quantity_traded" numeric(16,3),
    "water_quantity_with_price" numeric,
    "net_price" numeric,
    "avg_price_per_unit" numeric(10,2),
    "unit" text,
    "region" text,
    "origin_state" text not null,
    "origin_system" text,
    "origin_wrpa" text,
    "origin_trading_zone" text,
    "source_trading_zone_id" numeric(9) not null,
    "destination_state" text not null,
    "destination_system" text,
    "destination_wrpa" text,
    "destination_trading_zone" text,
    "destination_trading_zone_id" numeric(9) not null,
    "smdb_flag" numeric(1),
    "price_missing" text,
    "water_resource_type_local" text not null,
    "water_resource_type_national" text,
    "surface_ground_water_code" text
);

drop table if exists wid_schema."tblu_alloc_trade_water_syst" cascade;
create table wid_schema."tblu_alloc_trade_water_syst"
(
    "id" bigserial primary key,
    "day" date not null,
    "week" date not null,
    "month_code" text,
    "season_code" text,
    "fy_code" text,
    "water_quantity_traded" numeric(16,3),
    "water_quantity_with_price" numeric,
    "net_price" numeric,
    "avg_price_per_unit" numeric(10,2),
    "region" text,
    "unit" text,
    "origin_state" text not null,
    "destination_state" text not null,
    "origin_system" text,
    "destination_system" text,
    "source_water_system_id" numeric(9) not null,
    "destination_water_system_id" numeric(9) not null,
    "smdb_flag" numeric(1),
    "price_missing" text,
    "water_resource_type_local" text not null,
    "water_resource_type_national" text,
    "surface_ground_water_code" text
);

drop table if exists wid_schema."tblu_alloc_trade_chart_state" cascade;
create table wid_schema."tblu_alloc_trade_chart_state"
(
    "id" bigserial primary key,
    "state_code" text,
    "fy_code" text,
    "trade_vol" numeric,
    "flag" text,
    "surface_ground_water_code" text
);

drop table if exists wid_schema."tblu_alloc_trade_chart_ws_mdb" cascade;
create table wid_schema."tblu_alloc_trade_chart_ws_mdb"
(
    "id" bigserial primary key,
    "state_code" text,
    "water_system_name" text,
    "fy_code" text,
    "season_code" text,
    "month_code" text,
    "trade_vol" numeric,
    "flag" text,
    "region" text,
    "water_resource_type_national" text,
    "surface_ground_water_code" text
);

drop table if exists wid_schema."tblu_alloc_trade_table_state" cascade;
create table wid_schema."tblu_alloc_trade_table_state"
(
    "id" bigserial primary key,
    "state_code" text,
    "fy_code" text,
    "trade_vol_internal" numeric,
    "trade_vol_in" numeric,
    "trade_vol_out" numeric,
    "trade_vol_net" numeric,
    "surface_ground_water_code" text
);

drop table if exists wid_schema."tblu_alloc_trade_table_ws_mdb" cascade;
create table wid_schema."tblu_alloc_trade_table_ws_mdb"
(
    "id" bigserial primary key,
    "state_code" text,
    "water_system_name" text,
    "fy_code" text,
    "season_code" text,
    "month_code" text,
    "trade_vol_internal" numeric,
    "trade_vol_in" numeric,
    "trade_vol_out" numeric,
    "trade_vol_net" numeric,
    "region" text,
    "water_resource_type_national" text,
    "surface_ground_water_code" text
);

-- water markets - entitlements
drop table if exists wid_schema."tblu_entit_trade_mdb" cascade;
create table wid_schema."tblu_entit_trade_mdb"
(
    "id" bigserial primary key,
    "day" date not null,
    "week" date not null,
    "month_code" text,
    "season_code" text,
    "fy_code" text,
    "water_quantity_traded" numeric(16,3),
    "other_quantity_traded" numeric(12,3),
    "net_price" numeric,
    "avg_price_per_unit" numeric(10,2),
    "water_quantity_with_price" numeric,
    "uom_code" text,
    "price_missing" text,
    "water_resource_type_local" text not null,
    "water_resource_type_national" text,
    "surface_ground_water_code" text,
    "mdb_north_flag" numeric(1),
    "mdb_south_flag" numeric(1)
);

drop table if exists wid_schema."tblu_entit_trade_national" cascade;
create table wid_schema."tblu_entit_trade_national"
(
    "id" bigserial primary key,
    "day" date not null,
    "week" date not null,
    "month_code" text,
    "season_code" text,
    "fy_code" text,
    "water_quantity_traded" numeric(16,3),
    "other_quantity_traded" numeric(12,3),
    "net_price" numeric,
    "avg_price_per_unit" numeric(10,2),
    "water_quantity_with_price" numeric,
    "uom_code" text,
    "origin_state" text not null,
    "smdb_flag" numeric(1),
    "price_missing" text,
    "water_resource_type_local" text not null,
    "water_resource_type_national" text,
    "surface_ground_water_code" text
);

drop table if exists wid_schema."tblu_entit_trade_state" cascade;
create table wid_schema."tblu_entit_trade_state"
(
    "id" bigserial primary key,
    "day" date not null,
    "week" date not null,
    "month_code" text,
    "season_code" text,
    "fy_code" text,
    "water_quantity_traded" numeric(16,3),
    "other_quantity_traded" numeric(12,3),
    "net_price" numeric,
    "avg_price_per_unit" numeric(10,2),
    "water_quantity_with_price" numeric,
    "uom_code" text,
    "origin_state" text not null,
    "destination_state" text not null,
    "price_missing" text,
    "water_resource_type_local" text not null,
    "water_resource_type_national" text,
    "surface_ground_water_code" text,
    "mdb_flag" numeric(1),
    "mdb_north_flag" numeric(1),
    "mdb_south_flag" numeric(1)
);

drop table if exists wid_schema."tblu_entit_trade_trading_zone" cascade;
create table wid_schema."tblu_entit_trade_trading_zone"
(
    "id" bigserial primary key,
    "day" date not null,
    "week" date not null,
    "month_code" text,
    "season_code" text,
    "fy_code" text,
    "water_quantity_traded" numeric(16,3),
    "other_quantity_traded" numeric(12,3),
    "net_price" numeric,
    "avg_price_per_unit" numeric(10,2),
    "water_quantity_with_price" numeric,
    "unit" text,
    "origin_state" text not null,
    "origin_system" text,
    "origin_wrpa" text not null,
    "origin_trading_zone" text,
    "source_trading_zone_id" numeric(9) not null,
    "destination_state" text not null,
    "destination_system" text,
    "destination_wrpa" text,
    "destination_trading_zone" text,
    "destination_trading_zone_id" numeric(9) not null,
    "mdb_flag" numeric(1),
    "mdb_north_flag" numeric(1),
    "mdb_south_flag" numeric(1),
    "price_missing" text,
    "water_resource_type_local" text not null,
    "water_resource_type_national" text,
    "surface_ground_water_code" text
);

drop table if exists wid_schema."tblu_entit_trade_water_syst" cascade;
create table wid_schema."tblu_entit_trade_water_syst"
(
    "id" bigserial primary key,
    "day" date not null,
    "week" date not null,
    "month_code" text,
    "season_code" text,
    "fy_code" text,
    "water_quantity_traded" numeric(16,3),
    "other_quantity_traded" numeric(12,3),
    "net_price" numeric,
    "avg_price_per_unit" numeric(10,2),
    "water_quantity_with_price" numeric,
    "uom_code" text,
    "origin_state" text not null,
    "destination_state" text not null,
    "origin_system" text,
    "destination_system" text,
    "source_water_system_id" numeric(9) not null,
    "destination_water_system_id" numeric(9) not null,
    "mdb_flag" numeric(1),
    "mdb_north_flag" numeric(1),
    "mdb_south_flag" numeric(1),
    "price_missing" text,
    "water_resource_type_local" text not null,
    "water_resource_type_national" text,
    "surface_ground_water_code" text
);

-- water markets - entitlements on issue
drop table if exists wid_schema."tblu_entitlement_mdb" cascade;
create table wid_schema."tblu_entitlement_mdb"
(
    "id" bigserial primary key,
    "month_code" text,
    "season_code" text,
    "fy_code" text,
    "volume_of_water_ml" numeric(16,3),
    "number_not_ml" numeric(12,3),
    "uom_code" text not null,
    "state_code" text not null,
    "mdb_flag" numeric(1),
    "mdb_north_south_code" text,
    "water_right_type_name" text,
    "water_resource_type_local" text,
    "water_resource_type_national" text,
    "surface_ground_water_code" text,
    "water_reliability_name" text
);

drop table if exists wid_schema."tblu_entitlement_national" cascade;
create table wid_schema."tblu_entitlement_national"
(
    "id" bigserial primary key,
    "month_code" text,
    "season_code" text,
    "fy_code" text,
    "volume_of_water_ml" numeric(16,3),
    "number_not_ml" numeric(12,3),
    "uom_code" text not null,
    "state_code" text not null,
    "water_right_type_name" text,
    "water_resource_type_local" text,
    "water_resource_type_national" text,
    "surface_ground_water_code" text,
    "water_reliability_name" text
);

drop table if exists wid_schema."tblu_entitlement_state" cascade;
create table wid_schema."tblu_entitlement_state"
(
    "id" bigserial primary key,
    "month_code" text,
    "season_code" text,
    "fy_code" text,
    "volume_of_water_ml" numeric(16,3),
    "number_not_ml" numeric(12,3),
    "uom_code" text not null,
    "state_code" text not null,
    "water_right_type_name" text,
    "water_resource_type_local" text,
    "water_resource_type_national" text,
    "surface_ground_water_code" text,
    "water_reliability_name" text
);

drop table if exists wid_schema."tblu_entitlement_trading_zone" cascade;
create table wid_schema."tblu_entitlement_trading_zone"
(
    "id" bigserial primary key,
    "month_code" text,
    "season_code" text,
    "fy_code" text,
    "volume_of_water_ml" numeric(16,3),
    "number_not_ml" numeric(12,3),
    "uom_code" text not null,
    "state_code" text not null,
    "water_system_name" text,
    "wrpa_name" text,
    "trading_zone_desc" text,
    "mdb_flag" numeric(1),
    "mdb_north_south_code" text,
    "water_right_type_name" text,
    "water_resource_type_local" text,
    "water_resource_type_national" text,
    "surface_ground_water_code" text,
    "water_reliability_name" text
);

drop table if exists wid_schema."tblu_entitlement_water_syst" cascade;
create table wid_schema."tblu_entitlement_water_syst"
(
    "id" bigserial primary key,
    "month_code" text,
    "season_code" text,
    "fy_code" text,
    "volume_of_water_ml" numeric(16,3),
    "number_not_ml" numeric(12,3),
    "uom_code" text not null,
    "state_code" text not null,
    "water_system_name" text,
    "mdb_flag" numeric(1),
    "mdb_north_south_code" text,
    "water_right_type_name" text,
    "water_resource_type_local" text,
    "water_resource_type_national" text,
    "surface_ground_water_code" text,
    "water_reliability_name" text
);

--water information overview
drop table if exists wid_schema."tblu_trades" cascade;
create table wid_schema."tblu_trades"
(
    "id" bigserial primary key,
    "data_provider_code" text,
    "financial_year" date,
    "water_corp_state_code" text,
    "trade_indent" text,
    "water_resource_type_local" text,
    "water_resource_type_national" text,
    "surface_ground_water_code" text,
    "trade_type_local" text,
    "trade_type_national" text,
    "source_state_code" text,
    "state_name" text,
    "source_water_system_name" text,
    "source_wrpa_name" text,
    "source_trading_zone_name" text,
    "destination_state_code" text,
    "destination_water_system_name" text,
    "destination_wrpa_name" text,
    "destination_trading_zone_name" text,
    "water_quantity_traded" numeric(16,3),
    "gross_price" numeric(10,2),
    "net_price" numeric(10,2),
    "price_water_quantity" numeric,
    "date_of_application" date,
    "date_application_lodged" date,
    "date_of_approval" date,
    "date_of_lodgement_at_register" date,
    "date_of_registration" date,
    "trade_status_code" text,
    "environmental_trade_flag" numeric(1),
    "change_in_ownership_flag" numeric(1),
    "critical_needs_purchase_flag" numeric(1),
    "water_access_entitlement_ident" text,
    "water_right_type_name" text,
    "water_reliability_name" text,
    "interstate_trade_flag" numeric(1),
    "mdb_north_south_code" text,
    "murray_darling_basin_flag" numeric(1)
);

drop table if exists wid_schema."tblu_storage_view" cascade;
create table wid_schema."tblu_storage_view"
(
    "id" bigserial primary key,
    "run_date" date,
    "reporting_date" date not null,
    "storage_name" text,
    "web_storage_name" text,
    "state" text,
    "city" text,
    "drainage" text,
    "nat_water_account" text,
    "rural_system" text,
    "latitude" numeric(9,6),
    "longitude" numeric(9,6),
    "storage_description" text,
    "web_description_html" text,
    "web_description_plain" text,
    "constructed_year" date,
    "data_provider_name" text,
    "owner_name" text,
    "catchment_size_ha" numeric(12,3),
    "river" text,
    "water_height_full_ahd" text,
    "surface_area_ha" numeric(12,3),
    "water_depth_full" numeric(7,3),
    "height" numeric(7,3),
    "today_proportion_full" numeric(7,6),
    "today_day" date,
    "today_volume_active" numeric(16,3),
    "today_capacity_active" numeric(16,3),
    "change_since_yesterday" numeric,
    "change_since_last_week" numeric,
    "change_since_last_month" numeric,
    "change_since_last_year" numeric,
    "ystrday_proportion_full" numeric(7,6),
    "yestrday_day" date,
    "yestrday_volume_active" numeric(16,3),
    "yestrday_capacity_active" numeric(16,3),
    "last_week_proportion_full" numeric(7,6),
    "last_wk_day" date,
    "last_wk_volume_active" numeric(16,3),
    "last_wk_capacity_active" numeric(16,3),
    "lst_mth_proportion_full" numeric(7,6),
    "lst_mth_day" date,
    "lst_mth_volume_active" numeric(16,3),
    "lst_mth_capacity_active" numeric(16,3),
    "lst_yr_proportion_full" numeric(7,6),
    "lst_yr_day" date,
    "lst_yr_volume_active" numeric(16,3),
    "lst_yr_capacity_active" numeric(16,3)
);

drop table if exists wid_schema."tblu_storage_timeseries" cascade;
create table wid_schema."tblu_storage_timeseries"
(
    "id" bigserial primary key,
    "storage_name" text,
    "storage_id" numeric,
    "current_flag" numeric,
    "extrapolated_data_flag" numeric,
    "city" text,
    "river" text,
    "drainage" text,
    "state" text,
    "nat_water_account" text,
    "rural_system" text,
    "observation_day" date,
    "data_provider_code" text,
    "capacity_active" numeric(16,3),
    "volume_active" numeric(16,3),
    "volume_active_quality_id" numeric,
    "proportion_full" numeric(7,6)
);

--water storages
drop table if exists wid_schema."tblu_storage_agg_state" cascade;
create table wid_schema."tblu_storage_agg_state"
(
    "id" bigserial primary key,
    "run_date" date,
    "group_name" text not null,
    "group_level" text not null,
    "latest_calc_reading_date" date,
    "today_proportion_full" numeric(7,6),
    "today_day" date,
    "today_volume_active" numeric(16,3),
    "today_capacity_active" numeric(16,3),
    "change_since_yesterday" numeric,
    "change_since_last_week" numeric,
    "change_since_last_month" numeric,
    "change_since_last_year" numeric,
    "ystrday_proportion_full" numeric(7,6),
    "ystrday_day" date,
    "ystrday_volume_active" numeric(16,3),
    "ystrday_capacity_active" numeric(16,3),
    "lst_week_proportion_full" numeric(7,6),
    "lst_wk_day" date,
    "lst_wk_volume_active" numeric(16,3),
    "lst_wk_capacity_active" numeric(16,3),
    "lst_mth_proportion_full" numeric(7,6),
    "lst_mth_day" date,
    "lst_mth_volume_active" numeric(16,3),
    "lst_mth_capacity_active" numeric(16,3),
    "lst_yr_proportion_full" numeric(7,6),
    "lst_yr_day" date,
    "lst_yr_volume_active" numeric(16,3),
    "lst_yr_capacity_active" numeric(16,3)
);

drop table if exists wid_schema."tblu_storage_agg_drainage" cascade;
create table wid_schema."tblu_storage_agg_drainage"
(
    "id" bigserial primary key,
    "run_date" date,
    "group_name" text not null,
    "group_level" text not null,
    "latest_calc_reading_date" date,
    "today_proportion_full" numeric(7,6),
    "today_day" date,
    "today_volume_active" numeric(16,3),
    "today_capacity_active" numeric(16,3),
    "change_since_yesterday" numeric,
    "change_since_last_week" numeric,
    "change_since_last_month" numeric,
    "change_since_last_year" numeric,
    "ystrday_proportion_full" numeric(7,6),
    "ystrday_day" date,
    "ystrday_volume_active" numeric(16,3),
    "ystrday_capacity_active" numeric(16,3),
    "lst_week_proportion_full" numeric(7,6),
    "lst_wk_day" date,
    "lst_wk_volume_active" numeric(16,3),
    "lst_wk_capacity_active" numeric(16,3),
    "lst_mth_proportion_full" numeric(7,6),
    "lst_mth_day" date,
    "lst_mth_volume_active" numeric(16,3),
    "lst_mth_capacity_active" numeric(16,3),
    "lst_yr_proportion_full" numeric(7,6),
    "lst_yr_day" date,
    "lst_yr_volume_active" numeric(16,3),
    "lst_yr_capacity_active" numeric(16,3)
);
