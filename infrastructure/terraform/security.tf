# ============================================================================
# SECURITY GROUPS
# ============================================================================
# Security groups act as virtual firewalls for your EC2 instances.
# They control inbound and outbound traffic at the instance level.
#
# Learning Resources:
# - Security Groups: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html
# - Best Practices: https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html
#
# Key Concepts:
# - Ingress: Inbound traffic (coming into the instance)
# - Egress: Outbound traffic (going out from the instance)
# - Security groups are STATEFUL: if you allow inbound traffic, the response
#   is automatically allowed out, regardless of egress rules
# ============================================================================

# ----------------------------------------------------------------------------
# EC2 Security Group
# ----------------------------------------------------------------------------
# This security group controls access to the EC2 instance.

resource "aws_security_group" "ec2" {
  name        = "${local.name_prefix}-ec2-sg"
  description = "Security group for portfolio EC2 instance"
  vpc_id      = aws_vpc.main.id

  # --------------------------------------------------------------------------
  # Ingress Rules (Inbound)
  # --------------------------------------------------------------------------

  # SSH Access (Port 22)
  # TODO: In production, restrict this to your IP or use a bastion host
  ingress {
    description = "SSH from allowed CIDR blocks"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidr_blocks
  }

  # HTTP Access (Port 80)
  # Required for Let's Encrypt certificate validation and HTTP->HTTPS redirect
  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allow from anywhere for web traffic
  }

  # HTTPS Access (Port 443)
  # Main entry point for secure web traffic
  ingress {
    description = "HTTPS from anywhere"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allow from anywhere for web traffic
  }

  # --------------------------------------------------------------------------
  # Egress Rules (Outbound)
  # --------------------------------------------------------------------------
  # Allow all outbound traffic - the instance needs to:
  # - Pull Docker images from ECR
  # - Download packages (yum, npm, etc.)
  # - Send logs to CloudWatch
  # - Make HTTPS requests (e.g., Let's Encrypt)

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"          # -1 means all protocols
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${local.name_prefix}-ec2-sg"
  }

  # Lifecycle rule to prevent recreation when rules change
  lifecycle {
    create_before_destroy = true
  }
}

# ----------------------------------------------------------------------------
# Security Group Rules as Separate Resources (Alternative Approach)
# ----------------------------------------------------------------------------
# You can also define rules as separate resources for more flexibility.
# This is useful when rules need to reference other security groups.
#
# Example:
# resource "aws_security_group_rule" "ssh" {
#   type              = "ingress"
#   from_port         = 22
#   to_port           = 22
#   protocol          = "tcp"
#   cidr_blocks       = var.allowed_ssh_cidr_blocks
#   security_group_id = aws_security_group.ec2.id
#   description       = "SSH access"
# }

# ----------------------------------------------------------------------------
# Additional Security Recommendations for Production
# ----------------------------------------------------------------------------
#
# 1. Use a Bastion Host / Jump Box for SSH
#    - Create a separate security group for the bastion
#    - Only allow SSH to EC2 from the bastion security group
#    - Only allow SSH to bastion from your IP
#
# 2. Use AWS Systems Manager Session Manager
#    - Eliminates the need for SSH port 22
#    - Provides audit logging
#    - No need to manage SSH keys
#
# 3. Use VPC Endpoints
#    - Create VPC endpoints for ECR, CloudWatch, S3
#    - Traffic stays within AWS network (more secure, potentially cheaper)
#
# 4. Enable AWS Config Rules
#    - Monitor for security group changes
#    - Alert on overly permissive rules
