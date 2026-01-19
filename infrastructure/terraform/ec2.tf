# ============================================================================
# EC2 INSTANCE CONFIGURATION
# ============================================================================
# This file creates the EC2 instance that will host your portfolio.
# It includes:
# - EC2 instance with user data script for initial setup
# - Elastic IP for a static public IP address
# - IAM instance profile for AWS API access
#
# Learning Resources:
# - EC2 Instances: https://docs.aws.amazon.com/ec2/
# - User Data: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html
# - Elastic IPs: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html
# ============================================================================

# ----------------------------------------------------------------------------
# EC2 Instance
# ----------------------------------------------------------------------------

resource "aws_instance" "portfolio" {
  ami           = data.aws_ami.amazon_linux_2023.id
  instance_type = var.instance_type

  # Network configuration
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.ec2.id]
  associate_public_ip_address = true

  # SSH key pair for access
  key_name = var.ec2_key_name

  # IAM role for AWS API access (ECR, CloudWatch, etc.)
  iam_instance_profile = aws_iam_instance_profile.ec2.name

  # Root volume configuration
  root_block_device {
    volume_type           = "gp3"      # General Purpose SSD (newest generation)
    volume_size           = 30         # Minimum 30GB required by AMI snapshot
    delete_on_termination = true       # Delete volume when instance is terminated
    encrypted             = true       # Encrypt the volume

    tags = {
      Name = "${local.name_prefix}-root-volume"
    }
  }

  # User data script runs on first boot
  # This installs Docker and basic dependencies
  user_data = base64encode(templatefile("${path.module}/templates/user_data.sh", {
    aws_region     = var.aws_region
    ecr_repo_url   = aws_ecr_repository.portfolio.repository_url
    log_group_name = aws_cloudwatch_log_group.portfolio.name
  }))

  # Detailed monitoring (1-minute intervals instead of 5)
  # Note: This has additional cost outside free tier
  monitoring = false  # Set to true for production

  # Enable termination protection for production
  # This prevents accidental deletion via console or API
  disable_api_termination = var.environment == "prod" ? true : false

  tags = {
    Name = "${local.name_prefix}-instance"
  }

  # Wait for the instance profile to be ready before creating
  depends_on = [
    aws_iam_instance_profile.ec2,
    aws_ecr_repository.portfolio,
  ]

  lifecycle {
    # Ignore changes to AMI - we don't want to recreate the instance
    # when a new AMI is released (Ansible will handle updates)
    ignore_changes = [ami]
  }
}

# ----------------------------------------------------------------------------
# Elastic IP
# ----------------------------------------------------------------------------
# An Elastic IP provides a static public IP address.
# Without this, the public IP would change if the instance is stopped/started.
#
# Note: Elastic IPs are free when attached to a running instance.
# They cost money when NOT attached or attached to a stopped instance.

resource "aws_eip" "portfolio" {
  domain = "vpc"

  tags = {
    Name = "${local.name_prefix}-eip"
  }
}

# Associate the Elastic IP with the EC2 instance
resource "aws_eip_association" "portfolio" {
  instance_id   = aws_instance.portfolio.id
  allocation_id = aws_eip.portfolio.id
}

# ----------------------------------------------------------------------------
# EC2 Instance Connect (Optional)
# ----------------------------------------------------------------------------
# Allows SSH access via the AWS Console without needing to manage SSH keys.
# This is automatically enabled for Amazon Linux 2023.
#
# To use:
# 1. Go to EC2 Console -> Instances -> Select instance
# 2. Click "Connect" -> "EC2 Instance Connect"
# 3. Click "Connect"

# ----------------------------------------------------------------------------
# CloudWatch Alarm for Instance Status
# ----------------------------------------------------------------------------
# Creates an alarm that triggers if the instance fails status checks.

resource "aws_cloudwatch_metric_alarm" "instance_status" {
  alarm_name          = "${local.name_prefix}-instance-status"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "StatusCheckFailed"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Maximum"
  threshold           = 0
  alarm_description   = "This alarm monitors EC2 instance status check failures"

  dimensions = {
    InstanceId = aws_instance.portfolio.id
  }

  # TODO: Add SNS topic ARN for notifications
  # alarm_actions = [aws_sns_topic.alerts.arn]

  tags = {
    Name = "${local.name_prefix}-instance-status-alarm"
  }
}
