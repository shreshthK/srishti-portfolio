#!/bin/bash
# ============================================================================
# EC2 USER DATA SCRIPT
# ============================================================================
# This script runs on the first boot of the EC2 instance.
# It installs essential software and configures the system.
#
# NOTE: This is a Terraform template file. Variables like ${aws_region}
# are replaced by Terraform before the script runs.
#
# User data scripts:
# - Run as root
# - Run only on first boot (unless you use cloud-init)
# - Output is logged to /var/log/cloud-init-output.log
# ============================================================================

set -e  # Exit on any error
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "=========================================="
echo "Starting EC2 User Data Script"
echo "=========================================="

# ----------------------------------------------------------------------------
# System Updates
# ----------------------------------------------------------------------------
echo "Updating system packages..."
dnf update -y

# ----------------------------------------------------------------------------
# Install Docker
# ----------------------------------------------------------------------------
echo "Installing Docker..."
dnf install -y docker

# Start and enable Docker service
systemctl start docker
systemctl enable docker

# Add ec2-user to docker group (allows running docker without sudo)
usermod -aG docker ec2-user

# ----------------------------------------------------------------------------
# Install AWS CLI (should be pre-installed on Amazon Linux 2023)
# ----------------------------------------------------------------------------
echo "Verifying AWS CLI installation..."
aws --version || dnf install -y aws-cli

# ----------------------------------------------------------------------------
# Configure AWS Region for CLI
# ----------------------------------------------------------------------------
echo "Configuring AWS region..."
mkdir -p /root/.aws
cat > /root/.aws/config << 'AWSCONFIG'
[default]
region = ${aws_region}
AWSCONFIG

# Also configure for ec2-user
mkdir -p /home/ec2-user/.aws
cp /root/.aws/config /home/ec2-user/.aws/config
chown -R ec2-user:ec2-user /home/ec2-user/.aws

# ----------------------------------------------------------------------------
# Install CloudWatch Agent
# ----------------------------------------------------------------------------
echo "Installing CloudWatch Agent..."
dnf install -y amazon-cloudwatch-agent

# Create CloudWatch Agent configuration
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << 'CWCONFIG'
{
  "agent": {
    "metrics_collection_interval": 60,
    "run_as_user": "root"
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/messages",
            "log_group_name": "${log_group_name}",
            "log_stream_name": "{instance_id}/messages",
            "retention_in_days": 30
          },
          {
            "file_path": "/var/log/docker",
            "log_group_name": "${log_group_name}",
            "log_stream_name": "{instance_id}/docker",
            "retention_in_days": 30
          },
          {
            "file_path": "/var/log/user-data.log",
            "log_group_name": "${log_group_name}",
            "log_stream_name": "{instance_id}/user-data",
            "retention_in_days": 30
          }
        ]
      }
    }
  },
  "metrics": {
    "namespace": "Portfolio",
    "metrics_collected": {
      "cpu": {
        "measurement": ["cpu_usage_idle", "cpu_usage_user", "cpu_usage_system"],
        "metrics_collection_interval": 60
      },
      "disk": {
        "measurement": ["used_percent"],
        "metrics_collection_interval": 60,
        "resources": ["/"]
      },
      "mem": {
        "measurement": ["mem_used_percent"],
        "metrics_collection_interval": 60
      }
    }
  }
}
CWCONFIG

# Start CloudWatch Agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
  -s

systemctl enable amazon-cloudwatch-agent

# ----------------------------------------------------------------------------
# Install Nginx (will be configured by Ansible, but install here for speed)
# ----------------------------------------------------------------------------
echo "Installing Nginx..."
dnf install -y nginx

# Don't start Nginx yet - Ansible will configure it
systemctl enable nginx

# ----------------------------------------------------------------------------
# Install Additional Useful Tools
# ----------------------------------------------------------------------------
echo "Installing additional tools..."
dnf install -y \
  git \
  htop \
  jq \
  vim

# ----------------------------------------------------------------------------
# ECR Login Helper (for automatic Docker login)
# ----------------------------------------------------------------------------
echo "Setting up ECR credential helper..."

# Create a script for ECR login
cat > /usr/local/bin/ecr-login.sh << 'ECRLOGIN'
#!/bin/bash
aws ecr get-login-password --region ${aws_region} | \
  docker login --username AWS --password-stdin ${ecr_repo_url}
ECRLOGIN

chmod +x /usr/local/bin/ecr-login.sh

# Add ECR login to root's crontab (refresh token every 6 hours)
(crontab -l 2>/dev/null; echo "0 */6 * * * /usr/local/bin/ecr-login.sh > /dev/null 2>&1") | crontab -

# ----------------------------------------------------------------------------
# Create Application Directory
# ----------------------------------------------------------------------------
echo "Creating application directory..."
mkdir -p /opt/portfolio
chown ec2-user:ec2-user /opt/portfolio

# ----------------------------------------------------------------------------
# Create Deployment Script
# ----------------------------------------------------------------------------
echo "Creating deployment script..."
cat > /opt/portfolio/deploy.sh << 'DEPLOYSCRIPT'
#!/bin/bash
# Deployment script for portfolio application
set -e

ECR_REPO="${ecr_repo_url}"
CONTAINER_NAME="portfolio"
IMAGE_TAG="$${1:-latest}"

echo "Deploying $ECR_REPO:$IMAGE_TAG..."

# Login to ECR
/usr/local/bin/ecr-login.sh

# Pull the latest image
docker pull "$ECR_REPO:$IMAGE_TAG"

# Stop and remove existing container (if any)
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Run new container
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p 3000:80 \
  "$ECR_REPO:$IMAGE_TAG"

# Wait for container to be healthy
echo "Waiting for container to be healthy..."
sleep 5

# Check if container is running
if docker ps | grep -q $CONTAINER_NAME; then
  echo "Deployment successful!"
  docker ps | grep $CONTAINER_NAME
else
  echo "Deployment failed! Container is not running."
  docker logs $CONTAINER_NAME
  exit 1
fi

# Clean up old images
docker image prune -f
DEPLOYSCRIPT

chmod +x /opt/portfolio/deploy.sh
chown ec2-user:ec2-user /opt/portfolio/deploy.sh

# ----------------------------------------------------------------------------
# Set Up Log Rotation for Docker
# ----------------------------------------------------------------------------
echo "Configuring Docker log rotation..."
cat > /etc/docker/daemon.json << 'DOCKERCONFIG'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
DOCKERCONFIG

# Restart Docker to apply log settings
systemctl restart docker

# ----------------------------------------------------------------------------
# Initial ECR Login
# ----------------------------------------------------------------------------
echo "Performing initial ECR login..."
/usr/local/bin/ecr-login.sh || echo "ECR login failed - IAM role may not be ready yet"

# ----------------------------------------------------------------------------
# Completion
# ----------------------------------------------------------------------------
echo "=========================================="
echo "EC2 User Data Script Complete!"
echo "=========================================="
echo "Instance is ready for Ansible configuration."
echo ""
echo "Next steps:"
echo "1. Run Ansible playbook to complete setup"
echo "2. Push Docker image to ECR"
echo "3. Run deployment script: /opt/portfolio/deploy.sh"
