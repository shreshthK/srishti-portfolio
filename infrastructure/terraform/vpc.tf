# ============================================================================
# VPC (VIRTUAL PRIVATE CLOUD) CONFIGURATION
# ============================================================================
# This file creates the networking infrastructure:
# - VPC: Your isolated network in AWS
# - Subnet: A subdivision of the VPC
# - Internet Gateway: Allows internet access
# - Route Table: Defines how traffic flows
#
# Learning Resources:
# - AWS VPC Concepts: https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html
# - Terraform VPC: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc
#
# Architecture:
# ┌─────────────────────────────────────────────────────────┐
# │                         VPC                             │
# │                    (10.0.0.0/16)                        │
# │  ┌─────────────────────────────────────────────────┐    │
# │  │              Public Subnet                      │    │
# │  │              (10.0.1.0/24)                      │    │
# │  │  ┌─────────────┐                                │    │
# │  │  │    EC2      │                                │    │
# │  │  │  Instance   │                                │    │
# │  │  └─────────────┘                                │    │
# │  └─────────────────────────────────────────────────┘    │
# │                         │                               │
# │                    Route Table                          │
# │                         │                               │
# │                  Internet Gateway ←───→ Internet        │
# └─────────────────────────────────────────────────────────┘
# ============================================================================

# ----------------------------------------------------------------------------
# VPC
# ----------------------------------------------------------------------------
# The VPC is your isolated virtual network in AWS.
# All resources will be created within this VPC.

resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr

  # Enable DNS support (required for Route 53 private hosted zones)
  enable_dns_support = true

  # Enable DNS hostnames (required for public DNS names on EC2 instances)
  enable_dns_hostnames = true

  tags = {
    Name = "${local.name_prefix}-vpc"
  }
}

# ----------------------------------------------------------------------------
# Internet Gateway
# ----------------------------------------------------------------------------
# The Internet Gateway allows resources in public subnets to communicate
# with the internet. Without this, your EC2 instance wouldn't be accessible.

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${local.name_prefix}-igw"
  }
}

# ----------------------------------------------------------------------------
# Public Subnet
# ----------------------------------------------------------------------------
# A subnet is a range of IP addresses in your VPC.
# "Public" means instances here can have public IP addresses.
#
# We're using a single public subnet for simplicity.
# In production, you'd typically have subnets in multiple availability zones.

resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.public_subnet_cidr
  availability_zone = data.aws_availability_zones.available.names[0]

  # Auto-assign public IPv4 addresses to instances launched here
  map_public_ip_on_launch = true

  tags = {
    Name = "${local.name_prefix}-public-subnet"
    Type = "public"
  }
}

# ----------------------------------------------------------------------------
# Route Table
# ----------------------------------------------------------------------------
# Route tables contain rules (routes) that determine where network traffic
# from your subnet is directed.

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  # Route all internet-bound traffic (0.0.0.0/0) through the Internet Gateway
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${local.name_prefix}-public-rt"
  }
}

# Associate the route table with the public subnet
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# ----------------------------------------------------------------------------
# VPC Flow Logs (Optional but Recommended for Production)
# ----------------------------------------------------------------------------
# Flow logs capture information about IP traffic going to and from
# network interfaces in your VPC. Useful for troubleshooting and security.
#
# TODO: Uncomment to enable VPC flow logs (requires CloudWatch log group)
#
# resource "aws_flow_log" "main" {
#   vpc_id                   = aws_vpc.main.id
#   traffic_type             = "ALL"
#   log_destination_type     = "cloud-watch-logs"
#   log_destination          = aws_cloudwatch_log_group.vpc_flow_logs.arn
#   iam_role_arn             = aws_iam_role.vpc_flow_logs.arn
#
#   tags = {
#     Name = "${local.name_prefix}-flow-logs"
#   }
# }
