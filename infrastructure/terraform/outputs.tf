# Output definitions for the Microsoft Excel application infrastructure

output "resource_group_name" {
  description = "The name of the created resource group"
  value       = azurerm_resource_group.excel-rg.name
}

output "app_service_name" {
  description = "The name of the created App Service"
  value       = azurerm_app_service.excel-app-service.name
}

output "app_service_default_hostname" {
  description = "The default hostname of the created App Service"
  value       = azurerm_app_service.excel-app-service.default_site_hostname
}

output "sql_server_name" {
  description = "The name of the created SQL Server"
  value       = azurerm_sql_server.excel-sql-server.name
}

output "sql_database_name" {
  description = "The name of the created SQL Database"
  value       = azurerm_sql_database.excel-db.name
}

output "storage_account_name" {
  description = "The name of the created Storage Account"
  value       = azurerm_storage_account.excelstorageaccount.name
}

output "redis_cache_name" {
  description = "The name of the created Redis Cache"
  value       = azurerm_redis_cache.excel-redis-cache.name
}

output "redis_cache_hostname" {
  description = "The hostname of the created Redis Cache"
  value       = azurerm_redis_cache.excel-redis-cache.hostname
}