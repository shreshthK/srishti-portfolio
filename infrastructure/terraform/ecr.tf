# ============================================================================
# ECR (ELASTIC CONTAINER REGISTRY) CONFIGURATION
# ============================================================================
# ECR is AWS's managed Docker container registry.
# It stores, manages, and deploys Docker container images.
#
# Benefits of ECR:
# - Fully integrated with IAM for access control
# - Images are encrypted at rest
# - High availability and durability
# - Integrated with ECS, EKS, and EC2
#
# Learning Resources:
# - ECR User Guide: https://docs.aws.amazon.com/AmazonECR/latest/userguide/
# - Terraform ECR: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecr_repository
# ============================================================================

# ----------------------------------------------------------------------------
# ECR Repository
# ----------------------------------------------------------------------------
# This is where your Docker images will be stored.

resource "aws_ecr_repository" "portfolio" {
  name = "${local.name_prefix}-app"

  # Image tag mutability
  # MUTABLE: Same tag can be used for different images (e.g., 'latest')
  # IMMUTABLE: Each tag can only be used once (better for traceability)
  image_tag_mutability = "MUTABLE"

  # Enable image scanning on push
  # This scans images for known vulnerabilities
  image_scanning_configuration {
    scan_on_push = true
  }

  # Encryption configuration
  # By default, ECR encrypts images using AWS managed keys
  # You can optionally use your own KMS key for additional control
  encryption_configuration {
    encryption_type = "AES256"  # or "KMS" for customer managed key
  }

  # Force delete repository even if it contains images
  # Be careful with this in production!
  force_delete = var.environment != "prod"

  tags = {
    Name = "${local.name_prefix}-ecr"
  }
}

# ----------------------------------------------------------------------------
# ECR Lifecycle Policy
# ----------------------------------------------------------------------------
# Automatically clean up old images to reduce storage costs.
# This policy keeps only the most recent N images.

resource "aws_ecr_lifecycle_policy" "portfolio" {
  repository = aws_ecr_repository.portfolio.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last ${var.ecr_image_retention_count} images"
        selection = {
          tagStatus     = "any"
          countType     = "imageCountMoreThan"
          countNumber   = var.ecr_image_retention_count
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# ----------------------------------------------------------------------------
# ECR Repository Policy (Optional)
# ----------------------------------------------------------------------------
# Repository policies control who can access the repository.
# By default, only the account that created it has access.
#
# Uncomment if you need cross-account access or more granular permissions.
#
# resource "aws_ecr_repository_policy" "portfolio" {
#   repository = aws_ecr_repository.portfolio.name
#
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Sid    = "AllowPush"
#         Effect = "Allow"
#         Principal = {
#           AWS = "arn:aws:iam::${local.account_id}:root"
#         }
#         Action = [
#           "ecr:GetDownloadUrlForLayer",
#           "ecr:BatchGetImage",
#           "ecr:BatchCheckLayerAvailability",
#           "ecr:PutImage",
#           "ecr:InitiateLayerUpload",
#           "ecr:UploadLayerPart",
#           "ecr:CompleteLayerUpload"
#         ]
#       }
#     ]
#   })
# }

# ----------------------------------------------------------------------------
# Pull Through Cache (Optional - for caching Docker Hub images)
# ----------------------------------------------------------------------------
# ECR can cache images from upstream registries like Docker Hub.
# This reduces rate limiting issues and improves pull speed.
#
# resource "aws_ecr_pull_through_cache_rule" "docker_hub" {
#   ecr_repository_prefix = "docker-hub"
#   upstream_registry_url = "registry-1.docker.io"
# }
