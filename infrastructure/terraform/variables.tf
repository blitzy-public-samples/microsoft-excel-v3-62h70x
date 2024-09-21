# The Azure region where resources will be created
variable "location" {
  type        = string
  description = "The Azure region where resources will be created"
  default     = "East US"
}

# The deployment environment (e.g., dev, staging, prod)
variable "environment" {
  type        = string
  description = "The deployment environment (e.g., dev, staging, prod)"
  default     = "dev"
}

# The administrator username for the SQL database
variable "db_admin_username" {
  type        = string
  description = "The administrator username for the SQL database"
  sensitive   = true
}

# The administrator password for the SQL database
variable "db_admin_password" {
  type        = string
  description = "The administrator password for the SQL database"
  sensitive   = true
}

# The SKU for the App Service Plan
variable "app_service_sku" {
  type = object({
    tier = string
    size = string
  })
  description = "The SKU for the App Service Plan"
  default = {
    tier = "Standard"
    size = "S1"
  }
}

# The edition of the SQL database
variable "sql_database_edition" {
  type        = string
  description = "The edition of the SQL database"
  default     = "Standard"
}

# The service objective name for the SQL database
variable "sql_database_service_objective" {
  type        = string
  description = "The service objective name for the SQL database"
  default     = "S0"
}

# The tier of the storage account
variable "storage_account_tier" {
  type        = string
  description = "The tier of the storage account"
  default     = "Standard"
}

# The replication type for the storage account
variable "storage_account_replication_type" {
  type        = string
  description = "The replication type for the storage account"
  default     = "LRS"
}

# The family for the Redis cache
variable "redis_cache_family" {
  type        = string
  description = "The family for the Redis cache"
  default     = "C"
}

# The SKU for the Redis cache
variable "redis_cache_sku" {
  type        = string
  description = "The SKU for the Redis cache"
  default     = "Standard"
}