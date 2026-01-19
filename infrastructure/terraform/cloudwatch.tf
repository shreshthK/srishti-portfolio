# ============================================================================
# CLOUDWATCH MONITORING CONFIGURATION
# ============================================================================
# CloudWatch provides monitoring and observability for AWS resources.
# This file sets up:
# - Log groups for application and system logs
# - Metric alarms for important thresholds
# - Dashboard for at-a-glance monitoring
#
# Learning Resources:
# - CloudWatch Concepts: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html
# - CloudWatch Agent: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html
# ============================================================================

# ----------------------------------------------------------------------------
# CloudWatch Log Group
# ----------------------------------------------------------------------------
# A log group is a container for log streams (individual log sources).
# We'll send application logs, Nginx logs, and system logs here.

resource "aws_cloudwatch_log_group" "portfolio" {
  name = "/portfolio/${var.environment}"

  # Log retention in days
  # Longer retention = higher cost
  # Common values: 7, 14, 30, 60, 90, 180, 365
  retention_in_days = 30

  # Optional: encrypt logs with KMS
  # kms_key_id = aws_kms_key.logs.arn

  tags = {
    Name        = "${local.name_prefix}-logs"
    Application = "portfolio"
  }
}

# ----------------------------------------------------------------------------
# CloudWatch Alarms
# ----------------------------------------------------------------------------
# Alarms watch metrics and trigger actions when thresholds are crossed.

# CPU Utilization Alarm
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "${local.name_prefix}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300  # 5 minutes
  statistic           = "Average"
  threshold           = 80   # Alert when CPU > 80%

  alarm_description = "This alarm monitors EC2 CPU utilization"

  dimensions = {
    InstanceId = aws_instance.portfolio.id
  }

  # Actions when alarm triggers
  # TODO: Create an SNS topic for notifications
  # alarm_actions = [aws_sns_topic.alerts.arn]
  # ok_actions    = [aws_sns_topic.alerts.arn]

  tags = {
    Name = "${local.name_prefix}-high-cpu-alarm"
  }
}

# Memory Utilization Alarm (requires CloudWatch Agent)
resource "aws_cloudwatch_metric_alarm" "high_memory" {
  alarm_name          = "${local.name_prefix}-high-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "mem_used_percent"
  namespace           = "Portfolio"  # Custom namespace from CloudWatch Agent
  period              = 300
  statistic           = "Average"
  threshold           = 85  # Alert when memory > 85%

  alarm_description = "This alarm monitors EC2 memory utilization"

  # TODO: Add alarm_actions for notifications

  tags = {
    Name = "${local.name_prefix}-high-memory-alarm"
  }
}

# Disk Space Alarm (requires CloudWatch Agent)
resource "aws_cloudwatch_metric_alarm" "low_disk" {
  alarm_name          = "${local.name_prefix}-low-disk"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "disk_used_percent"
  namespace           = "Portfolio"
  period              = 300
  statistic           = "Average"
  threshold           = 80  # Alert when disk > 80% full

  alarm_description = "This alarm monitors EC2 disk utilization"

  # TODO: Add alarm_actions for notifications

  tags = {
    Name = "${local.name_prefix}-low-disk-alarm"
  }
}

# ----------------------------------------------------------------------------
# CloudWatch Dashboard (Optional)
# ----------------------------------------------------------------------------
# Dashboards provide a customizable view of your metrics.
# Uncomment to create a dashboard for monitoring.

# resource "aws_cloudwatch_dashboard" "portfolio" {
#   dashboard_name = "${local.name_prefix}-dashboard"
#
#   dashboard_body = jsonencode({
#     widgets = [
#       {
#         type   = "metric"
#         x      = 0
#         y      = 0
#         width  = 12
#         height = 6
#         properties = {
#           title   = "CPU Utilization"
#           view    = "timeSeries"
#           stacked = false
#           metrics = [
#             ["AWS/EC2", "CPUUtilization", "InstanceId", aws_instance.portfolio.id]
#           ]
#           period = 300
#           region = var.aws_region
#         }
#       },
#       {
#         type   = "metric"
#         x      = 12
#         y      = 0
#         width  = 12
#         height = 6
#         properties = {
#           title   = "Memory Utilization"
#           view    = "timeSeries"
#           stacked = false
#           metrics = [
#             ["Portfolio", "mem_used_percent"]
#           ]
#           period = 300
#           region = var.aws_region
#         }
#       },
#       {
#         type   = "log"
#         x      = 0
#         y      = 6
#         width  = 24
#         height = 6
#         properties = {
#           title  = "Application Logs"
#           region = var.aws_region
#           query  = "SOURCE '${aws_cloudwatch_log_group.portfolio.name}' | fields @timestamp, @message | sort @timestamp desc | limit 100"
#         }
#       }
#     ]
#   })
# }

# ----------------------------------------------------------------------------
# SNS Topic for Alerts (Optional)
# ----------------------------------------------------------------------------
# SNS (Simple Notification Service) can send alerts via email, SMS, etc.
#
# TODO: Uncomment and configure for production alerting

# resource "aws_sns_topic" "alerts" {
#   name = "${local.name_prefix}-alerts"
#
#   tags = {
#     Name = "${local.name_prefix}-alerts"
#   }
# }

# Email subscription
# resource "aws_sns_topic_subscription" "email" {
#   topic_arn = aws_sns_topic.alerts.arn
#   protocol  = "email"
#   endpoint  = "your-email@example.com"  # TODO: Replace with your email
# }
