# Portfolio Deployment Guide

Complete step-by-step guide for deploying the portfolio to AWS EC2 using Terraform, Ansible, and GitHub Actions.

## Progress Tracker

Use this checklist to track your progress. Mark items with `[x]` when completed.

### Phase 1: Prerequisites & AWS Setup
- [ ] Install Terraform
- [ ] Install Ansible
- [ ] Install AWS CLI
- [ ] Create AWS account
- [ ] Create IAM user for Terraform
- [ ] Configure AWS CLI credentials
- [ ] Create EC2 key pair

### Phase 2: Terraform Infrastructure
- [ ] Copy and configure terraform.tfvars
- [ ] Run terraform init
- [ ] Run terraform plan
- [ ] Run terraform apply
- [ ] Save terraform outputs
- [ ] Verify SSH access to EC2

### Phase 3: Ansible Configuration
- [ ] Install Ansible collections
- [ ] Configure inventory file
- [ ] Test Ansible connectivity (ping)
- [ ] Run setup playbook

### Phase 4: GitHub Actions Setup
- [ ] Create GitHub Actions IAM access key
- [ ] Add AWS_ACCESS_KEY_ID secret
- [ ] Add AWS_SECRET_ACCESS_KEY secret
- [ ] Add AWS_REGION secret
- [ ] Add ECR_REPOSITORY secret
- [ ] Add EC2_HOST secret
- [ ] Add EC2_SSH_KEY secret
- [ ] Test CI/CD pipeline with a push

### Phase 5: Domain & SSL (Optional)
- [ ] Register/configure domain
- [ ] Update Terraform for DNS
- [ ] Apply DNS changes
- [ ] Run Certbot for SSL
- [ ] Verify HTTPS access

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: AWS Setup](#phase-1-aws-setup)
3. [Phase 2: Terraform Infrastructure](#phase-2-terraform-infrastructure)
4. [Phase 3: Ansible Configuration](#phase-3-ansible-configuration)
5. [Phase 4: GitHub Actions Setup](#phase-4-github-actions-setup)
6. [Phase 5: Domain & SSL Setup](#phase-5-domain--ssl-setup)
7. [Daily Operations](#daily-operations)
8. [Cost Management](#cost-management)

---

## Prerequisites

### Step 1: Install Required Tools

- [x] **Install Terraform**
  ```bash
  # macOS
  brew install terraform

  # Verify
  terraform --version
  ```
  Expected: Version >= 1.0.0

- [x] **Install Ansible**
  ```bash
  # macOS
  brew install ansible

  # Verify
  ansible --version
  ```
  Expected: Version >= 2.9

- [x] **Install AWS CLI**
  ```bash
  # macOS
  brew install awscli

  # Verify
  aws --version
  ```
  Expected: AWS CLI v2

### Step 2: Create AWS Account

- [x] Create an AWS account at [aws.amazon.com](https://aws.amazon.com) (skip if you have one)
- [x] Sign in to the AWS Console

---

## Phase 1: AWS Setup

### Step 1.1: Create IAM User for Terraform

- [x] Go to **AWS Console > IAM > Users > Create user**
- [x] Set user name: `terraform-admin`
- [x] **Important:** Do NOT enable "Provide user access to the AWS Management Console" - this user is for programmatic access only
- [x] Select **Attach policies directly**
- [x] Add these policies:
  - [x] `AmazonEC2FullAccess`
  - [x] `AmazonEC2ContainerRegistryFullAccess`
  - [x] `AmazonVPCFullAccess`
  - [x] `IAMFullAccess`
  - [x] `CloudWatchFullAccess`
  - [x] `AmazonRoute53FullAccess` (optional, for custom domain)
- [x] Click **Create user**
- [x] Go to the user > **Security credentials** > **Create access key**
- [x] Select **Command Line Interface (CLI)**
- [x] Save credentials securely:
  - [x] Access Key ID: `YOUR_AWS_ACCESS_KEY_ID`
  - [x] Secret Access Key: `YOUR_AWS_SECRET_ACCESS_KEY`

### Step 1.2: Configure AWS CLI

- [x] Run AWS configure:
  ```bash
  aws configure
  ```
  Enter when prompted:
  - AWS Access Key ID: (from step 1.1)
  - AWS Secret Access Key: (from step 1.1)
  - Default region: `us-east-1` (or your preferred region)
  - Default output format: `json`

- [x] Verify configuration:
  ```bash
  aws sts get-caller-identity
  ```
  Expected: JSON with your account info

### Step 1.3: Create EC2 Key Pair

- [x] Create key pair:
  ```bash
  aws ec2 create-key-pair \
    --key-name portfolio-key \
    --query 'KeyMaterial' \
    --output text > ~/.ssh/portfolio-key.pem
  ```

- [x] Set correct permissions:
  ```bash
  chmod 400 ~/.ssh/portfolio-key.pem
  ```

- [x] Verify key exists:
  ```bash
  ls -la ~/.ssh/portfolio-key.pem
  ```

---

## Phase 2: Terraform Infrastructure

### Step 2.1: Configure Terraform Variables

- [x] Navigate to terraform directory:
  ```bash
  cd infrastructure/terraform
  ```

- [x] Copy example file:
  ```bash
  cp terraform.tfvars.example terraform.tfvars
  ```

- [x] Edit `terraform.tfvars` with your values:
  ```bash
  # Use your preferred editor
  vim terraform.tfvars
  # or
  code terraform.tfvars
  ```

- [x] Update these required values:
  ```hcl
  project_name = "portfolio"
  environment  = "prod"
  aws_region   = "us-east-1"  # Your region

  ec2_key_name = "portfolio-key"
  instance_type = "t2.micro"

  # IMPORTANT: Replace with your IP for security
  # Find your IP: curl ifconfig.me
  allowed_ssh_cidr_blocks = ["YOUR_IP/32"]
  ```

- [x] Save the file

### Step 2.2: Initialize Terraform

- [x] Run init:
  ```bash
  terraform init
  ```
  Expected: "Terraform has been successfully initialized!"

### Step 2.3: Preview Infrastructure

- [x] Run plan:
  ```bash
  terraform plan
  ```
  Expected: Shows resources to be created (VPC, EC2, ECR, etc.)

- [x] Review the plan - should show approximately:
  - 1 VPC
  - 1 Subnet
  - 1 Internet Gateway
  - 1 Security Group
  - 1 EC2 Instance
  - 1 Elastic IP
  - 1 ECR Repository
  - IAM roles and policies
  - CloudWatch resources

### Step 2.4: Apply Infrastructure

- [x] Run apply:
  ```bash
  terraform apply
  ```

- [x] Type `yes` when prompted

- [x] Wait for completion (usually 2-5 minutes)

- [x] Expected: "Apply complete! Resources: X added, 0 changed, 0 destroyed."

### Step 2.5: Save Terraform Outputs

- [x] View and save outputs:
  ```bash
  terraform output
  ```

- [x] Record these values (you'll need them later):

  | Output | Your Value |
  |--------|------------|
  | `ec2_public_ip` | `3.214.56.190` |
  | `ecr_repository_url` | `226155456642.dkr.ecr.us-east-1.amazonaws.com/portfolio-prod-app` |
  | `github_actions_user_name` | `portfolio-prod-github-actions` |

### Step 2.6: Verify SSH Access

- [x] SSH into the instance:
  ```bash
  ssh -i ~/.ssh/portfolio-key.pem ec2-user@YOUR_EC2_IP
  ```
  Replace `YOUR_EC2_IP` with the IP from step 2.5

- [x] Verify Docker is installed:
  ```bash
  docker --version
  ```

- [x] Exit SSH session:
  ```bash
  exit
  ```

---

## Phase 3: Ansible Configuration

### Step 3.1: Install Ansible Dependencies

**Note:** Run all collection install commands from the `infrastructure/ansible` directory to ensure collections are installed in the project-local location.

- [x] Install AWS collection:
  ```bash
  cd infrastructure/ansible
  ansible-galaxy collection install amazon.aws
  ```

- [x] Install Docker collection:
  ```bash
  cd infrastructure/ansible
  ansible-galaxy collection install community.docker
  ```

- [x] Install POSIX collection:
  ```bash
  cd infrastructure/ansible
  ansible-galaxy collection install ansible.posix
  ```

- [x] Install Python dependencies:
  ```bash
  # Run from anywhere - installs to your local Python environment (where Ansible runs)
  # On macOS with Homebrew Python, --break-system-packages is needed for Ansible dependencies
  pip3 install --break-system-packages boto3 botocore
  ```

### Step 3.2: Configure Ansible Inventory

- [x] Navigate to ansible directory:
  ```bash
  cd infrastructure/ansible
  ```

- [x] Copy inventory example:
  ```bash
  cp inventory/hosts.example inventory/hosts
  ```

- [x] Edit inventory file:
  ```bash
  vim inventory/hosts
  ```

- [x] Update with your values:
  ```ini
  [portfolio_servers]
  portfolio ansible_host=YOUR_EC2_IP  # From terraform output

  [portfolio_servers:vars]
  ansible_user=ec2-user
  ansible_ssh_private_key_file=~/.ssh/portfolio-key.pem
  ansible_python_interpreter=/usr/bin/python3

  [all:vars]
  aws_region=us-east-1
  ecr_repository_url=YOUR_ECR_URL  # From terraform output
  ```

- [x] Update `ansible.cfg` SSH key path if different:
  ```bash
  vim ansible.cfg
  # Check: private_key_file = ~/.ssh/portfolio-key.pem
  ```

### Step 3.3: Test Ansible Connectivity

- [x] Run ping test:
  ```bash
  ansible portfolio_servers -m ping
  ```

- [x] Expected output:
  ```
  portfolio | SUCCESS => {
      "ping": "pong"
  }
  ```

### Step 3.4: Run Setup Playbook

- [x] Run the setup playbook:
  ```bash
  ansible-playbook playbooks/setup.yml
  ```

- [x] Wait for completion (usually 3-5 minutes)

- [x] Expected: All tasks should show "ok" or "changed", no "failed"

---

## Phase 4: GitHub Actions Setup

### Step 4.1: Create GitHub Actions Access Key

- [x] Get IAM username from terraform:
  ```bash
  cd infrastructure/terraform
  terraform output github_actions_user_name
  ```

- [x] Create access key:
  ```bash
  aws iam create-access-key --user-name portfolio-prod-github-actions
  ```

- [x] **IMPORTANT: Save the output immediately!**

  | Credential | Your Value |
  |------------|------------|
  | AccessKeyId | `YOUR_AWS_ACCESS_KEY_ID` |
  | SecretAccessKey | `YOUR_AWS_SECRET_ACCESS_KEY` |

### Step 4.2: Configure GitHub Secrets

Go to your GitHub repository: **Settings > Secrets and variables > Actions**

- [x] Add `AWS_ACCESS_KEY_ID`
  - Click "New repository secret"
  - Name: `AWS_ACCESS_KEY_ID`
  - Value: (AccessKeyId from step 4.1)

- [x] Add `AWS_SECRET_ACCESS_KEY`
  - Name: `AWS_SECRET_ACCESS_KEY`
  - Value: (SecretAccessKey from step 4.1)

- [x] Add `AWS_REGION`
  - Name: `AWS_REGION`
  - Value: `us-east-1` (or your region)

- [x] Add `ECR_REPOSITORY`
  - Name: `ECR_REPOSITORY`
  - Value: (ecr_repository_url from terraform output)

- [x] Add `EC2_HOST`
  - Name: `EC2_HOST`
  - Value: (ec2_public_ip from terraform output)

- [x] Add `EC2_SSH_KEY`
  - Name: `EC2_SSH_KEY`
  - Value: (entire contents of ~/.ssh/portfolio-key.pem)

  Get the key contents:
  ```bash
  cat ~/.ssh/portfolio-key.pem
  ```
  Copy everything including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`

### Step 4.3: Test CI/CD Pipeline

- [ ] Make a small change and push:
  ```bash
  git add .
  git commit -m "Setup CI/CD infrastructure"
  git push origin main
  ```

- [ ] Go to GitHub > **Actions** tab

- [ ] Verify CI workflow runs and passes

- [ ] Verify CD workflow runs and deploys

- [ ] Test the deployment:
  ```bash
  curl http://YOUR_EC2_IP/health
  ```
  Expected: `healthy`

---

## Phase 5: Domain & SSL Setup

> **Note:** This phase is optional. Skip if you're okay accessing via IP address.

### Step 5.1: Register/Configure Domain

**Option A: Register via Route 53**

- [ ] Go to **AWS Console > Route 53 > Registered Domains**
- [ ] Click **Register Domain**
- [ ] Search for your desired domain
- [ ] Complete registration (~$12/year for .com)
- [ ] Note the Hosted Zone ID:

  | Info | Your Value |
  |------|------------|
  | Domain Name | `___________________________` |
  | Hosted Zone ID | `___________________________` |

**Option B: Use Existing Domain**

- [ ] Go to **AWS Console > Route 53 > Hosted Zones**
- [ ] Click **Create hosted zone**
- [ ] Enter your domain name
- [ ] Copy NS (nameserver) records
- [ ] Update nameservers at your domain registrar
- [ ] Wait 24-48 hours for DNS propagation
- [ ] Note the Hosted Zone ID

### Step 5.2: Update Terraform for DNS

- [ ] Edit `infrastructure/terraform/terraform.tfvars`:
  ```hcl
  domain_name        = "yourdomain.com"
  create_dns_records = true
  route53_zone_id    = "YOUR_ZONE_ID"
  ```

- [ ] Apply DNS changes:
  ```bash
  cd infrastructure/terraform
  terraform apply
  ```

- [ ] Verify DNS (may take a few minutes):
  ```bash
  dig yourdomain.com
  ```
  Should return your EC2 Elastic IP

### Step 5.3: Set Up SSL with Let's Encrypt

- [ ] SSH into EC2:
  ```bash
  ssh -i ~/.ssh/portfolio-key.pem ec2-user@YOUR_EC2_IP
  ```

- [ ] Run Certbot:
  ```bash
  sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
  ```

- [ ] Follow prompts:
  - [ ] Enter email for renewal notices
  - [ ] Agree to terms of service
  - [ ] Choose to redirect HTTP to HTTPS (recommended)

- [ ] Exit SSH:
  ```bash
  exit
  ```

- [ ] Verify HTTPS:
  ```bash
  curl https://yourdomain.com/health
  ```
  Expected: `healthy`

---

## Deployment Complete! 🎉

If you've completed all checkboxes above, your portfolio is now:
- ✅ Hosted on AWS EC2
- ✅ Container image stored in ECR
- ✅ Auto-deploying on push to main
- ✅ Monitored with CloudWatch
- ✅ (Optional) Accessible via custom domain with SSL

---

## Daily Operations

### Manual Deployment

```bash
# SSH into EC2
ssh -i ~/.ssh/portfolio-key.pem ec2-user@YOUR_EC2_IP

# Deploy latest image
/opt/portfolio/deploy.sh

# Deploy specific tag
/opt/portfolio/deploy.sh abc123
```

### Rollback

```bash
# SSH into EC2
ssh -i ~/.ssh/portfolio-key.pem ec2-user@YOUR_EC2_IP

# Rollback to previous version
/opt/portfolio/scripts/rollback.sh
```

### Health Check

```bash
# From your local machine
curl http://YOUR_EC2_IP/health

# Or if you have a domain
curl https://yourdomain.com/health
```

### View Logs

```bash
# SSH into EC2
ssh -i ~/.ssh/portfolio-key.pem ec2-user@YOUR_EC2_IP

# Docker container logs
docker logs portfolio --tail 100 -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## Cost Management

### Estimated Monthly Costs

| Service | Free Tier | After Free Tier |
|---------|-----------|-----------------|
| EC2 t2.micro | $0 (750 hrs/mo) | ~$8.50 |
| ECR Storage | 500 MB free | ~$0.10/GB |
| Elastic IP | $0 (attached) | $3.60 (detached) |
| CloudWatch | 5 GB logs free | ~$0.50/GB |
| Route 53 | - | ~$0.50/zone |
| **Total** | **$0-5** | **~$15-20** |

### Cleanup (Destroy Everything)

When you're done or want to start over:

```bash
cd infrastructure/terraform
terraform destroy
```

---

## Quick Reference

### Commands Cheat Sheet

```bash
# Terraform
cd infrastructure/terraform
terraform init          # Initialize
terraform plan          # Preview changes
terraform apply         # Apply changes
terraform output        # View outputs
terraform destroy       # Destroy everything

# Ansible
cd infrastructure/ansible
ansible portfolio_servers -m ping              # Test connection
ansible-playbook playbooks/setup.yml           # Initial setup
ansible-playbook playbooks/deploy.yml \
  -e "ecr_repository_url=..." \
  -e "image_tag=latest"                        # Deploy

# SSH
ssh -i ~/.ssh/portfolio-key.pem ec2-user@IP

# Docker on EC2
docker ps                    # List running containers
docker logs portfolio        # View logs
docker exec -it portfolio sh # Shell into container
```

---

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.
