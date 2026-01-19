# Deployment Tools Overview

This document explains each tool used in the portfolio deployment process and their specific roles.

---

## Table of Contents

1. [Infrastructure as Code](#infrastructure-as-code)
2. [Configuration Management](#configuration-management)
3. [CI/CD Pipeline](#cicd-pipeline)
4. [Containerization](#containerization)
5. [Web Server](#web-server)
6. [Cloud Services](#cloud-services)
7. [Command Line Tools](#command-line-tools)
8. [Security & SSL](#security--ssl)

---

## Infrastructure as Code

### Terraform

**What it is:** Infrastructure as Code (IaC) tool that defines and provisions cloud resources using declarative configuration files.

**Role in deployment:**
- **Creates AWS infrastructure** before deployment (VPC, EC2 instance, ECR repository, security groups, etc.)
- **Manages infrastructure state** - tracks what resources exist and their current configuration
- **Ensures consistency** - same infrastructure can be recreated identically every time
- **Enables version control** - infrastructure changes are tracked in code

**How it works:**
1. You write `.tf` files describing desired infrastructure
2. Run `terraform plan` to preview changes
3. Run `terraform apply` to create/update resources
4. Terraform communicates with AWS API to provision resources

**Key commands:**
- `terraform init` - Downloads providers and initializes backend
- `terraform plan` - Shows what will be created/changed
- `terraform apply` - Creates/updates infrastructure
- `terraform destroy` - Removes all infrastructure

---

## Configuration Management

### Ansible

**What it is:** Automation tool that configures servers and installs software using playbooks (YAML files).

**Role in deployment:**
- **Configures the EC2 server** after Terraform creates it
- **Installs and configures software** (Docker, Nginx, CloudWatch agent)
- **Sets up deployment scripts** and systemd services
- **Manages server state** - ensures server is configured correctly

**How it works:**
1. Connects to EC2 via SSH using your key pair
2. Reads playbook files (`.yml`) that define tasks
3. Executes tasks sequentially (install packages, create files, start services)
4. Idempotent - running multiple times produces same result

**Key concepts:**
- **Inventory** (`inventory/hosts`) - Lists servers to configure
- **Playbooks** (`playbooks/*.yml`) - Define what to configure
- **Roles** (`roles/*/`) - Reusable configuration modules
- **Modules** - Pre-built tasks (e.g., `apt`, `docker_container`, `file`)

**Why not just SSH and install manually?**
- Repeatable - same configuration every time
- Version controlled - changes tracked in git
- Scalable - can configure multiple servers simultaneously
- Documented - playbooks serve as documentation

---

## CI/CD Pipeline

### GitHub Actions

**What it is:** GitHub's built-in CI/CD platform that runs workflows automatically on git events (push, pull request, etc.).

**Role in deployment:**
- **Builds Docker image** when you push code to main branch
- **Pushes image to ECR** (container registry)
- **Deploys to EC2** by pulling and running the new image
- **Automates the entire deployment** - no manual steps needed

**How it works:**
1. You push code to GitHub
2. GitHub Actions workflow triggers automatically
3. Workflow runs in a GitHub-hosted virtual machine
4. Builds Docker image from your code
5. Pushes image to AWS ECR
6. SSHs into EC2 and runs deployment script
7. New container starts serving your app

**Workflow file:** `.github/workflows/deploy.yml` (defines the automation steps)

**Benefits:**
- **Zero manual deployment** - push code, deployment happens automatically
- **Consistent builds** - same environment every time
- **Fast feedback** - see if deployment succeeds/fails immediately

---

## Containerization

### Docker

**What it is:** Platform that packages applications and dependencies into containers - lightweight, portable units that run consistently anywhere.

**Role in deployment:**
- **Packages your app** into a container image
- **Ensures consistency** - app runs the same locally and on EC2
- **Isolates dependencies** - no conflicts with system packages
- **Simplifies deployment** - just run the container, no manual setup

**How it works:**
1. **Dockerfile** defines how to build your app (base image, install dependencies, copy files)
2. **Build** creates an image containing your app and all dependencies
3. **Push** to ECR (container registry) for storage
4. **Pull** on EC2 server
5. **Run** container - your app starts serving requests

**Key concepts:**
- **Image** - Snapshot of your app (like a template)
- **Container** - Running instance of an image
- **Dockerfile** - Instructions for building the image
- **Registry** (ECR) - Storage for images

**Why Docker?**
- **Portability** - runs anywhere Docker is installed
- **Consistency** - same environment in dev and production
- **Isolation** - app doesn't affect host system
- **Easy scaling** - can run multiple containers

---

## Web Server

### Nginx

**What it is:** High-performance web server and reverse proxy.

**Role in deployment:**
- **Serves static files** (HTML, CSS, JS) to users
- **Reverse proxy** - forwards requests to your app container
- **Handles SSL/TLS** termination (HTTPS)
- **Load balancing** (if multiple containers)
- **Security** - hides your app container from direct internet access

**How it works:**
1. User requests `http://yourdomain.com`
2. Nginx receives request on port 80/443
3. Nginx forwards request to your app container (port 3000 or similar)
4. App container processes request and returns response
5. Nginx sends response back to user

**Configuration:** `/etc/nginx/nginx.conf` and `/etc/nginx/sites-available/portfolio.conf`

**Benefits:**
- **Performance** - very fast at serving static files
- **Security** - only Nginx exposed to internet, not your app
- **SSL termination** - handles HTTPS certificates
- **Caching** - can cache responses for better performance

---

## Cloud Services

### AWS EC2 (Elastic Compute Cloud)

**What it is:** Virtual server in the cloud where your application runs.

**Role in deployment:**
- **Hosts your application** - the actual server running your portfolio
- **Provides compute resources** - CPU, memory, storage
- **Accessible via SSH** - you can connect and manage it
- **Runs Docker containers** - your app runs inside containers on EC2

**Instance type:** `t2.micro` (1 vCPU, 1 GB RAM) - free tier eligible

---

### AWS ECR (Elastic Container Registry)

**What it is:** Private Docker image registry - stores your container images.

**Role in deployment:**
- **Stores Docker images** - built by GitHub Actions
- **Version control for images** - tags identify different versions
- **Secure access** - only authorized users/services can pull images
- **Integration** - EC2 pulls images from ECR to deploy

**How it works:**
1. GitHub Actions builds image and pushes to ECR
2. ECR stores image with a tag (e.g., `latest`, `abc123`)
3. EC2 pulls image from ECR when deploying
4. EC2 runs container from pulled image

---

### AWS VPC (Virtual Private Cloud)

**What it is:** Isolated network environment in AWS.

**Role in deployment:**
- **Creates private network** for your EC2 instance
- **Controls network access** - defines what can communicate
- **Internet Gateway** - allows EC2 to access internet
- **Subnets** - divides network into segments

**Why needed:** EC2 needs a network to exist in, even if simple.

---

### AWS IAM (Identity and Access Management)

**What it is:** Service that manages user permissions and access to AWS resources.

**Role in deployment:**
- **Creates users** with specific permissions (Terraform user, GitHub Actions user)
- **Defines what each user can do** - least privilege principle
- **Provides access keys** - for programmatic access (CLI, APIs)
- **Security** - ensures only authorized access to AWS resources

**Users created:**
- `terraform-admin` - Can create/manage infrastructure
- `portfolio-prod-github-actions` - Can push to ECR and deploy

---

### AWS CloudWatch

**What it is:** Monitoring and logging service for AWS resources.

**Role in deployment:**
- **Collects logs** from your application and Nginx
- **Monitors metrics** - CPU, memory, disk usage
- **Alerts** - can notify you of issues
- **Centralized logging** - all logs in one place

**Benefits:**
- **Debugging** - see what's happening in production
- **Performance monitoring** - track resource usage
- **Cost tracking** - monitor AWS costs

---

### AWS Route 53

**What it is:** DNS (Domain Name System) service - translates domain names to IP addresses.

**Role in deployment:**
- **Manages DNS records** - maps `yourdomain.com` to EC2 IP address
- **Domain registration** - can register new domains
- **Health checks** - monitors if your site is up

**How it works:**
1. User types `yourdomain.com` in browser
2. Browser queries Route 53 for IP address
3. Route 53 returns EC2's Elastic IP
4. Browser connects to EC2

---

### Elastic IP

**What it is:** Static, public IP address that doesn't change when EC2 restarts.

**Role in deployment:**
- **Provides stable IP** - doesn't change if EC2 restarts
- **DNS mapping** - Route 53 points domain to this IP
- **Access** - users connect via this IP (or domain name)

**Why needed:** Regular EC2 IPs change when instance stops/starts. Elastic IP stays the same.

---

## Command Line Tools

### AWS CLI

**What it is:** Command-line interface for interacting with AWS services.

**Role in deployment:**
- **Creates resources** - key pairs, access keys, etc.
- **Queries AWS** - get information about resources
- **Configures credentials** - stores your AWS access keys locally
- **Scripting** - can automate AWS operations

**Key commands:**
- `aws configure` - Set up credentials
- `aws ec2 create-key-pair` - Create SSH key
- `aws iam create-access-key` - Create access key for user
- `aws sts get-caller-identity` - Verify credentials

**Why needed:** Some operations are easier/faster via CLI than web console.

---

### SSH (Secure Shell)

**What it is:** Protocol for securely connecting to remote servers.

**Role in deployment:**
- **Access EC2 server** - connect to manage server manually
- **Ansible uses SSH** - connects to EC2 to run playbooks
- **GitHub Actions uses SSH** - connects to deploy
- **Manual operations** - view logs, debug issues

**How it works:**
- Uses key pair authentication (public key on server, private key locally)
- Encrypted connection - all traffic is secure
- Command: `ssh -i ~/.ssh/portfolio-key.pem ec2-user@EC2_IP`

---

## Security & SSL

### Certbot

**What it is:** Tool that automatically obtains and renews SSL certificates from Let's Encrypt.

**Role in deployment:**
- **Obtains SSL certificate** - enables HTTPS for your domain
- **Configures Nginx** - updates config to use certificate
- **Auto-renewal** - certificates expire every 90 days, Certbot renews automatically
- **Free SSL** - Let's Encrypt provides free certificates

**How it works:**
1. Runs on EC2 server
2. Verifies you own the domain (via DNS or HTTP challenge)
3. Downloads SSL certificate from Let's Encrypt
4. Configures Nginx to use certificate
5. Sets up automatic renewal

**Command:** `sudo certbot --nginx -d yourdomain.com`

**Why needed:** HTTPS is required for secure web traffic and SEO benefits.

---

## How They Work Together

Here's the complete flow:

1. **Terraform** creates AWS infrastructure (EC2, ECR, VPC, etc.)
2. **Ansible** configures EC2 server (installs Docker, Nginx, etc.)
3. **GitHub Actions** builds Docker image and pushes to ECR
4. **EC2** pulls image from ECR and runs container
5. **Nginx** receives user requests and forwards to container
6. **CloudWatch** monitors and logs everything
7. **Route 53** maps domain name to EC2 IP
8. **Certbot** provides SSL certificate for HTTPS

**Result:** When you push code to GitHub, it automatically builds, deploys, and serves your portfolio to users via HTTPS.

---

## Quick Reference

| Tool | Purpose | When Used |
|------|---------|-----------|
| **Terraform** | Create AWS infrastructure | Initial setup, infrastructure changes |
| **Ansible** | Configure EC2 server | Initial setup, server configuration changes |
| **GitHub Actions** | Build and deploy | Every code push to main |
| **Docker** | Package and run app | Build time and runtime |
| **Nginx** | Serve web requests | Runtime (always running) |
| **EC2** | Host application | Runtime (always running) |
| **ECR** | Store Docker images | Build and deploy time |
| **CloudWatch** | Monitor and log | Runtime (continuous) |
| **Route 53** | DNS management | Domain setup, DNS changes |
| **Certbot** | SSL certificates | Initial SSL setup, renewal |

---

## Further Learning

- **Terraform:** [terraform.io/docs](https://www.terraform.io/docs)
- **Ansible:** [docs.ansible.com](https://docs.ansible.com)
- **Docker:** [docs.docker.com](https://docs.docker.com)
- **Nginx:** [nginx.org/en/docs](https://nginx.org/en/docs)
- **AWS:** [aws.amazon.com/documentation](https://aws.amazon.com/documentation)
