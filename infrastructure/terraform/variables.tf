# ============================================================================
# TERRAFORM VARIABLES
# ============================================================================
# This file defines all input variables for the infrastructure.
# Variables allow you to parameterize your configuration and reuse it
# across different environments (dev, staging, prod).
#
# Learning Resources:
# - Terraform Variables: https://developer.hashicorp.com/terraform/language/values/variables
# - Variable Validation: https://developer.hashicorp.com/terraform/language/values/variables#custom-validation-rules
# ============================================================================

# ----------------------------------------------------------------------------
# General Configuration
# ----------------------------------------------------------------------------

variable "project_name" {
  description = "Name of the project, used for resource naming and tagging"
  type        = string
  default     = "portfolio"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.project_name))
    error_message = "Project name must contain only lowercase letters, numbers, and hyphens."
  }
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "prod"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

# ----------------------------------------------------------------------------
# AWS Configuration
# ----------------------------------------------------------------------------

variable "aws_region" {
  description = <<-EOT
    AWS region to deploy resources in.

    TODO: Choose your preferred region based on:
    - Proximity to your users (for lower latency)
    - Service availability
    - Pricing

    Popular choices:
    - us-east-1 (N. Virginia) - Oldest region, most services available
    - us-west-2 (Oregon) - Good for US West Coast
    - eu-west-1 (Ireland) - Good for European users
  EOT
  type        = string
  default     = "us-east-1"  # TODO: Change to your preferred region
}

# ----------------------------------------------------------------------------
# VPC Configuration
# ----------------------------------------------------------------------------

variable "vpc_cidr" {
  description = <<-EOT
    CIDR block for the VPC.

    This defines the IP address range for your virtual private cloud.
    A /16 network gives you 65,536 IP addresses.

    Common choices:
    - 10.0.0.0/16 (10.0.0.0 - 10.0.255.255)
    - 172.16.0.0/16 (172.16.0.0 - 172.16.255.255)
    - 192.168.0.0/16 (192.168.0.0 - 192.168.255.255)
  EOT
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = <<-EOT
    CIDR block for the public subnet.

    This must be a subset of the VPC CIDR.
    A /24 network gives you 256 IP addresses (251 usable after AWS reservations).
  EOT
  type        = string
  default     = "10.0.1.0/24"
}

# ----------------------------------------------------------------------------
# EC2 Configuration
# ----------------------------------------------------------------------------

variable "instance_type" {
  description = <<-EOT
    EC2 instance type.

    TODO: Choose based on your needs:
    - t2.micro: Free tier eligible, 1 vCPU, 1 GB RAM (good for demos)
    - t3.micro: Better performance, 2 vCPU, 1 GB RAM
    - t3.small: 2 vCPU, 2 GB RAM (recommended for production)

    See pricing: https://aws.amazon.com/ec2/pricing/on-demand/
  EOT
  type        = string
  default     = "t2.micro"  # Free tier eligible
}

variable "ec2_key_name" {
  description = <<-EOT
    Name of the EC2 key pair for SSH access.

    TODO: Create a key pair before running terraform:
    1. Go to AWS Console -> EC2 -> Key Pairs
    2. Create key pair (RSA, .pem format)
    3. Save the .pem file securely (you'll need it for SSH)
    4. Set this variable to the key pair name

    Or create via AWS CLI:
    aws ec2 create-key-pair --key-name portfolio-key --query 'KeyMaterial' --output text > portfolio-key.pem
    chmod 400 portfolio-key.pem
  EOT
  type        = string
  # No default - must be provided
}

variable "allowed_ssh_cidr_blocks" {
  description = <<-EOT
    CIDR blocks allowed to SSH into the EC2 instance.

    SECURITY WARNING: Never use 0.0.0.0/0 in production!

    TODO: Replace with your IP address:
    1. Find your IP: curl ifconfig.me
    2. Add /32 for single IP: "1.2.3.4/32"

    For GitHub Actions deployment, you may need to allow GitHub's IP ranges
    or use a bastion host / VPN.
  EOT
  type        = list(string)
  default     = ["0.0.0.0/0"]  # TODO: Restrict this in production!
}

# ----------------------------------------------------------------------------
# ECR Configuration
# ----------------------------------------------------------------------------

variable "ecr_image_retention_count" {
  description = <<-EOT
    Number of images to retain in ECR.

    ECR can charge for storage, so it's good practice to clean up old images.
    This sets up a lifecycle policy to keep only the most recent N images.
  EOT
  type        = number
  default     = 10
}

# ----------------------------------------------------------------------------
# Domain Configuration (Route 53)
# ----------------------------------------------------------------------------

variable "domain_name" {
  description = <<-EOT
    Your domain name for the portfolio site.

    TODO: Options:
    1. Register a new domain via Route 53 (AWS Console -> Route 53 -> Register Domain)
    2. Use an existing domain and update nameservers to Route 53
    3. Leave empty to skip DNS configuration (access via IP only)

    Examples: "example.com", "myportfolio.dev"
  EOT
  type        = string
  default     = ""  # TODO: Set your domain name
}

variable "create_dns_records" {
  description = <<-EOT
    Whether to create DNS records in Route 53.

    Set to true only if:
    1. You have a domain registered in Route 53, OR
    2. You've created a hosted zone and updated nameservers at your registrar
  EOT
  type        = bool
  default     = false  # TODO: Set to true when you have a domain configured
}

variable "route53_zone_id" {
  description = <<-EOT
    Route 53 Hosted Zone ID for your domain.

    TODO: If you have a domain:
    1. Go to AWS Console -> Route 53 -> Hosted Zones
    2. Find your domain's hosted zone
    3. Copy the Zone ID (looks like: Z0123456789ABCDEFGHIJ)

    Leave empty if you don't have a domain yet.
  EOT
  type        = string
  default     = ""  # TODO: Set your hosted zone ID
}
