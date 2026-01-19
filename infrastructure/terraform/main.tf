# ============================================================================
# TERRAFORM MAIN CONFIGURATION
# ============================================================================
# This is the main entry point for your Terraform configuration.
# It defines the required providers and configures the AWS provider.
#
# Learning Resources:
# - Terraform AWS Provider: https://registry.terraform.io/providers/hashicorp/aws/latest/docs
# - Terraform Backends: https://developer.hashicorp.com/terraform/language/settings/backends
# ============================================================================

# ----------------------------------------------------------------------------
# Terraform Block
# ----------------------------------------------------------------------------
# Specifies the required Terraform version and providers.
# The 'required_providers' block tells Terraform which providers to download.

terraform {
  # Minimum Terraform version required
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"  # Use AWS provider version 5.x
    }
  }

  # ----------------------------------------------------------------------------
  # BACKEND CONFIGURATION (Optional - for team collaboration)
  # ----------------------------------------------------------------------------
  # Uncomment this block if you want to store Terraform state remotely in S3.
  # This is recommended for production and team environments.
  #
  # TODO: If you want remote state storage:
  # 1. Create an S3 bucket manually: aws s3 mb s3://your-terraform-state-bucket
  # 2. Create a DynamoDB table for state locking (optional but recommended)
  # 3. Uncomment and configure the backend block below
  #
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"  # TODO: Replace with your bucket name
  #   key            = "portfolio/terraform.tfstate"
  #   region         = "us-east-1"                    # TODO: Replace with your region
  #   encrypt        = true
  #   dynamodb_table = "terraform-state-lock"         # Optional: for state locking
  # }
}

# ----------------------------------------------------------------------------
# AWS Provider Configuration
# ----------------------------------------------------------------------------
# Configures the AWS provider with the region specified in variables.
# Credentials are read from environment variables or AWS CLI configuration.
#
# The provider uses credentials in this order:
# 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
# 2. Shared credentials file (~/.aws/credentials)
# 3. IAM role (if running on EC2)

provider "aws" {
  region = var.aws_region

  # Default tags applied to all resources
  # These help with cost tracking and resource management
  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# ----------------------------------------------------------------------------
# Data Sources
# ----------------------------------------------------------------------------
# Data sources allow Terraform to fetch information about existing resources.
# Here we get the current AWS account ID and available AZs.

# Get current AWS account ID (useful for constructing ARNs)
data "aws_caller_identity" "current" {}

# Get available availability zones in the region
data "aws_availability_zones" "available" {
  state = "available"
}

# Get the latest Amazon Linux 2023 AMI
# This ensures we always use the most recent, patched AMI
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

# ----------------------------------------------------------------------------
# Local Values
# ----------------------------------------------------------------------------
# Local values are like variables but computed within the configuration.
# They help avoid repetition and make the code more readable.

locals {
  # Common name prefix for resources
  name_prefix = "${var.project_name}-${var.environment}"

  # Current AWS account ID
  account_id = data.aws_caller_identity.current.account_id

  # Common tags (in addition to default_tags)
  common_tags = {
    CreatedAt = timestamp()
  }
}
