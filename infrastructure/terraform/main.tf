# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 2.65"
    }
  }

  backend "azurerm" {
    resource_group_name  = "excel-tfstate-rg"
    storage_account_name = "exceltfstate"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
}

# Create resource group
resource "azurerm_resource_group" "excel_rg" {
  name     = "excel-rg"
  location = var.location
}

# Create App Service Plan
resource "azurerm_app_service_plan" "excel_asp" {
  name                = "excel-app-service-plan"
  location            = azurerm_resource_group.excel_rg.location
  resource_group_name = azurerm_resource_group.excel_rg.name

  sku {
    tier = "Standard"
    size = "S1"
  }
}

# Create App Service
resource "azurerm_app_service" "excel_app" {
  name                = "excel-app-service"
  location            = azurerm_resource_group.excel_rg.location
  resource_group_name = azurerm_resource_group.excel_rg.name
  app_service_plan_id = azurerm_app_service_plan.excel_asp.id

  site_config {
    dotnet_framework_version = "v5.0"
    always_on                = true
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
  }
}

# Create SQL Server
resource "azurerm_sql_server" "excel_sql" {
  name                         = "excel-sql-server"
  resource_group_name          = azurerm_resource_group.excel_rg.name
  location                     = azurerm_resource_group.excel_rg.location
  version                      = "12.0"
  administrator_login          = var.db_admin_username
  administrator_login_password = var.db_admin_password
}

# Create SQL Database
resource "azurerm_sql_database" "excel_db" {
  name                             = "excel-db"
  resource_group_name              = azurerm_resource_group.excel_rg.name
  location                         = azurerm_resource_group.excel_rg.location
  server_name                      = azurerm_sql_server.excel_sql.name
  edition                          = "Standard"
  requested_service_objective_name = "S0"
}

# Create Storage Account
resource "azurerm_storage_account" "excel_storage" {
  name                     = "excelstorageaccount"
  resource_group_name      = azurerm_resource_group.excel_rg.name
  location                 = azurerm_resource_group.excel_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# Create Redis Cache
resource "azurerm_redis_cache" "excel_redis" {
  name                = "excel-redis-cache"
  location            = azurerm_resource_group.excel_rg.location
  resource_group_name = azurerm_resource_group.excel_rg.name
  capacity            = 1
  family              = "C"
  sku_name            = "Standard"
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"
}