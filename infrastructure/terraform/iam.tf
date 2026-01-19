# ============================================================================
# IAM (IDENTITY AND ACCESS MANAGEMENT) CONFIGURATION
# ============================================================================
# IAM manages access to AWS resources. This file creates:
# - IAM Role: Defines what the EC2 instance can do
# - IAM Policy: Specifies the permissions
# - Instance Profile: Attaches the role to EC2
#
# Key Concepts:
# - Principal: Who can assume the role (in this case, EC2 service)
# - Policy: What actions are allowed on which resources
# - Instance Profile: Container for the role that EC2 uses
#
# Learning Resources:
# - IAM Concepts: https://docs.aws.amazon.com/IAM/latest/UserGuide/intro-structure.html
# - IAM Roles for EC2: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html
# ============================================================================

# ----------------------------------------------------------------------------
# IAM Role for EC2
# ----------------------------------------------------------------------------
# This role allows the EC2 instance to assume a set of permissions.
# The "assume role policy" defines WHO can assume this role.

resource "aws_iam_role" "ec2" {
  name = "${local.name_prefix}-ec2-role"

  # Trust policy - allows EC2 service to assume this role
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${local.name_prefix}-ec2-role"
  }
}

# ----------------------------------------------------------------------------
# IAM Instance Profile
# ----------------------------------------------------------------------------
# An instance profile is a container for an IAM role that you can use
# to pass role information to an EC2 instance when the instance starts.

resource "aws_iam_instance_profile" "ec2" {
  name = "${local.name_prefix}-ec2-profile"
  role = aws_iam_role.ec2.name

  tags = {
    Name = "${local.name_prefix}-ec2-profile"
  }
}

# ----------------------------------------------------------------------------
# ECR Access Policy
# ----------------------------------------------------------------------------
# Allows the EC2 instance to pull images from ECR.

resource "aws_iam_role_policy" "ecr_access" {
  name = "${local.name_prefix}-ecr-access"
  role = aws_iam_role.ec2.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ECRGetAuthorizationToken"
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"  # GetAuthorizationToken doesn't support resource-level permissions
      },
      {
        Sid    = "ECRPullImages"
        Effect = "Allow"
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ]
        Resource = aws_ecr_repository.portfolio.arn
      }
    ]
  })
}

# ----------------------------------------------------------------------------
# CloudWatch Logs Policy
# ----------------------------------------------------------------------------
# Allows the EC2 instance to send logs to CloudWatch.

resource "aws_iam_role_policy" "cloudwatch_logs" {
  name = "${local.name_prefix}-cloudwatch-logs"
  role = aws_iam_role.ec2.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CloudWatchLogs"
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Resource = [
          aws_cloudwatch_log_group.portfolio.arn,
          "${aws_cloudwatch_log_group.portfolio.arn}:*"
        ]
      }
    ]
  })
}

# ----------------------------------------------------------------------------
# CloudWatch Metrics Policy
# ----------------------------------------------------------------------------
# Allows the CloudWatch agent to publish custom metrics.

resource "aws_iam_role_policy" "cloudwatch_metrics" {
  name = "${local.name_prefix}-cloudwatch-metrics"
  role = aws_iam_role.ec2.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CloudWatchMetrics"
        Effect = "Allow"
        Action = [
          "cloudwatch:PutMetricData"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "cloudwatch:namespace" = "Portfolio"
          }
        }
      }
    ]
  })
}

# ----------------------------------------------------------------------------
# SSM Policy (Optional - for Systems Manager access)
# ----------------------------------------------------------------------------
# Allows using AWS Systems Manager for:
# - Session Manager (SSH alternative)
# - Parameter Store (secrets management)
# - Patch Manager (automated patching)

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# ----------------------------------------------------------------------------
# GitHub Actions IAM User (For CI/CD)
# ----------------------------------------------------------------------------
# Creates an IAM user for GitHub Actions to push images to ECR
# and deploy to EC2.
#
# TODO: The access keys will need to be created manually and added
# to GitHub Secrets. Never commit credentials to code!

resource "aws_iam_user" "github_actions" {
  name = "${local.name_prefix}-github-actions"

  tags = {
    Name    = "${local.name_prefix}-github-actions"
    Purpose = "CI/CD from GitHub Actions"
  }
}

# Policy for GitHub Actions user
resource "aws_iam_user_policy" "github_actions" {
  name = "${local.name_prefix}-github-actions-policy"
  user = aws_iam_user.github_actions.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ECRAuthentication"
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      },
      {
        Sid    = "ECRPushPull"
        Effect = "Allow"
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ]
        Resource = aws_ecr_repository.portfolio.arn
      }
    ]
  })
}

# Note: Access keys need to be created manually for security:
# aws iam create-access-key --user-name portfolio-prod-github-actions
# Then add to GitHub Secrets: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
