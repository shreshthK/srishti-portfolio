# ============================================================================
# TERRAFORM OUTPUTS
# ============================================================================
# Outputs expose values from your infrastructure that you might need:
# - For other Terraform configurations
# - For scripts or CI/CD pipelines
# - For human operators
#
# Outputs are shown after 'terraform apply' and can be queried with
# 'terraform output' or 'terraform output <name>'.
#
# Learning Resources:
# - Terraform Outputs: https://developer.hashicorp.com/terraform/language/values/outputs
# ============================================================================

# ----------------------------------------------------------------------------
# EC2 Instance Outputs
# ----------------------------------------------------------------------------

output "ec2_instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.portfolio.id
}

output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance (Elastic IP)"
  value       = aws_eip.portfolio.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.portfolio.public_dns
}

# SSH connection string for convenience
output "ssh_connection" {
  description = "SSH command to connect to the EC2 instance"
  value       = "ssh -i <your-key.pem> ec2-user@${aws_eip.portfolio.public_ip}"
}

# ----------------------------------------------------------------------------
# ECR Outputs
# ----------------------------------------------------------------------------

output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.portfolio.repository_url
}

output "ecr_repository_arn" {
  description = "ARN of the ECR repository"
  value       = aws_ecr_repository.portfolio.arn
}

# Docker push command for convenience
output "docker_push_command" {
  description = "Command to push Docker image to ECR"
  value       = <<-EOT
    # Login to ECR
    aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${aws_ecr_repository.portfolio.repository_url}

    # Build and push
    docker build -t ${aws_ecr_repository.portfolio.repository_url}:latest .
    docker push ${aws_ecr_repository.portfolio.repository_url}:latest
  EOT
}

# ----------------------------------------------------------------------------
# VPC Outputs
# ----------------------------------------------------------------------------

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.public.id
}

# ----------------------------------------------------------------------------
# Security Group Outputs
# ----------------------------------------------------------------------------

output "ec2_security_group_id" {
  description = "ID of the EC2 security group"
  value       = aws_security_group.ec2.id
}

# ----------------------------------------------------------------------------
# CloudWatch Outputs
# ----------------------------------------------------------------------------

output "cloudwatch_log_group_name" {
  description = "Name of the CloudWatch log group"
  value       = aws_cloudwatch_log_group.portfolio.name
}

output "cloudwatch_log_group_arn" {
  description = "ARN of the CloudWatch log group"
  value       = aws_cloudwatch_log_group.portfolio.arn
}

# ----------------------------------------------------------------------------
# IAM Outputs
# ----------------------------------------------------------------------------

output "ec2_role_name" {
  description = "Name of the IAM role attached to EC2"
  value       = aws_iam_role.ec2.name
}

output "github_actions_user_name" {
  description = "Name of the IAM user for GitHub Actions"
  value       = aws_iam_user.github_actions.name
}

output "github_actions_user_arn" {
  description = "ARN of the IAM user for GitHub Actions"
  value       = aws_iam_user.github_actions.arn
}

# ----------------------------------------------------------------------------
# DNS Outputs (Conditional)
# ----------------------------------------------------------------------------

output "domain_name" {
  description = "Domain name (if configured)"
  value       = var.create_dns_records ? var.domain_name : "Not configured"
}

output "website_url" {
  description = "URL to access the portfolio"
  value       = var.create_dns_records ? "https://${var.domain_name}" : "http://${aws_eip.portfolio.public_ip}"
}

# ----------------------------------------------------------------------------
# GitHub Secrets Reference
# ----------------------------------------------------------------------------
# These are the values you need to add to GitHub Secrets for CI/CD

output "github_secrets_reference" {
  description = "Values needed for GitHub Secrets (create access key separately)"
  value       = <<-EOT
    GitHub Secrets to configure:

    AWS_REGION: ${var.aws_region}
    ECR_REPOSITORY: ${aws_ecr_repository.portfolio.repository_url}
    EC2_HOST: ${aws_eip.portfolio.public_ip}
    EC2_SSH_KEY: (your private key contents)
    AWS_ACCESS_KEY_ID: (create with: aws iam create-access-key --user-name ${aws_iam_user.github_actions.name})
    AWS_SECRET_ACCESS_KEY: (from the create-access-key output)
  EOT
  sensitive   = false
}

# ----------------------------------------------------------------------------
# Deployment Information
# ----------------------------------------------------------------------------

output "deployment_info" {
  description = "Information for manual deployment"
  value       = <<-EOT
    ================================================
    DEPLOYMENT INFORMATION
    ================================================

    EC2 Instance:
      - IP: ${aws_eip.portfolio.public_ip}
      - SSH: ssh -i <key.pem> ec2-user@${aws_eip.portfolio.public_ip}
      - Deploy: ssh ec2-user@${aws_eip.portfolio.public_ip} '/opt/portfolio/deploy.sh'

    ECR Repository:
      - URL: ${aws_ecr_repository.portfolio.repository_url}

    Website:
      - URL: ${var.create_dns_records ? "https://${var.domain_name}" : "http://${aws_eip.portfolio.public_ip}"}

    Next Steps:
      1. Create GitHub Actions access key:
         aws iam create-access-key --user-name ${aws_iam_user.github_actions.name}

      2. Add secrets to GitHub repository settings

      3. Run Ansible playbooks to configure EC2

      4. Push code to trigger CI/CD pipeline
    ================================================
  EOT
}
