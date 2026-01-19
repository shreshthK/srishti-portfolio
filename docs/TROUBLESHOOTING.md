# Troubleshooting Guide

Common issues and solutions for the portfolio deployment.

## Table of Contents

- [Terraform Issues](#terraform-issues)
- [Ansible Issues](#ansible-issues)
- [GitHub Actions Issues](#github-actions-issues)
- [EC2 & Docker Issues](#ec2--docker-issues)
- [Nginx Issues](#nginx-issues)
- [SSL/TLS Issues](#ssltls-issues)

---

## Terraform Issues

### "Error: No valid credential sources found"

**Problem:** AWS credentials not configured.

**Solution:**
```bash
# Configure AWS CLI
aws configure

# Or use environment variables
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_REGION="us-east-1"
```

### "Error: Invalid value for variable"

**Problem:** Missing or invalid variable in `terraform.tfvars`.

**Solution:**
```bash
# Make sure terraform.tfvars exists
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
vim terraform.tfvars
```

### "Error: Error creating EC2 Key Pair: InvalidKeyPair.Duplicate"

**Problem:** Key pair already exists.

**Solution:**
```bash
# Either use existing key
ec2_key_name = "existing-key-name"

# Or delete and recreate
aws ec2 delete-key-pair --key-name portfolio-key
aws ec2 create-key-pair --key-name portfolio-key \
  --query 'KeyMaterial' --output text > ~/.ssh/portfolio-key.pem
chmod 400 ~/.ssh/portfolio-key.pem
```

### "Error: Error launching source instance: VcpuLimitExceeded"

**Problem:** AWS account vCPU limit reached.

**Solution:**
1. Go to AWS Console > Service Quotas
2. Search for "EC2"
3. Request quota increase for "Running On-Demand Standard instances"
4. Or terminate unused EC2 instances

---

## Ansible Issues

### "UNREACHABLE! SSH connection failed"

**Problem:** Cannot connect to EC2 via SSH.

**Solutions:**

1. **Check security group:**
   ```bash
   # Verify port 22 is open
   aws ec2 describe-security-groups --group-ids sg-xxxxx
   ```

2. **Check your IP:**
   ```bash
   # Your current IP
   curl ifconfig.me

   # Update terraform.tfvars
   allowed_ssh_cidr_blocks = ["YOUR_IP/32"]
   terraform apply
   ```

3. **Check SSH key permissions:**
   ```bash
   chmod 400 ~/.ssh/portfolio-key.pem
   ```

4. **Test manual SSH:**
   ```bash
   ssh -i ~/.ssh/portfolio-key.pem -v ec2-user@YOUR_EC2_IP
   ```

### "Permission denied (publickey)"

**Problem:** Wrong SSH key or user.

**Solution:**
```bash
# Amazon Linux 2023 uses ec2-user
ssh -i ~/.ssh/portfolio-key.pem ec2-user@IP

# NOT ubuntu@ or admin@
```

### "No hosts matched"

**Problem:** Inventory not configured correctly.

**Solution:**
```bash
# Verify inventory
ansible-inventory --list

# Check inventory file
cat infrastructure/ansible/inventory/hosts
```

---

## GitHub Actions Issues

### "Error: The process '/usr/bin/docker' failed with exit code 1"

**Problem:** Docker build failed.

**Solution:**
1. Check Dockerfile syntax
2. Verify all files exist (especially nginx.conf)
3. Run build locally to test:
   ```bash
   docker build -t test .
   ```

### "Error: Unable to locate credentials"

**Problem:** AWS secrets not configured in GitHub.

**Solution:**
1. Go to Repository > Settings > Secrets and variables > Actions
2. Verify all secrets are set:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `ECR_REPOSITORY`
   - `EC2_HOST`
   - `EC2_SSH_KEY`

### "Host key verification failed"

**Problem:** SSH known_hosts issue.

**Solution:** The workflow already includes `StrictHostKeyChecking=no`. If still failing:
1. Check EC2_HOST secret is correct IP
2. Check EC2_SSH_KEY is complete (including BEGIN/END lines)

### "Permission denied, please try again"

**Problem:** SSH key issues.

**Solution:**
1. Regenerate key pair in AWS
2. Update EC2_SSH_KEY secret with new key
3. Make sure the entire key is copied (including headers)

---

## EC2 & Docker Issues

### Docker container not starting

```bash
# Check container status
docker ps -a

# View container logs
docker logs portfolio

# Check if port is in use
sudo netstat -tlnp | grep 3000
```

### "Cannot connect to the Docker daemon"

```bash
# Start Docker service
sudo systemctl start docker

# Check Docker status
sudo systemctl status docker

# If ec2-user can't run docker, re-add to group
sudo usermod -aG docker ec2-user
# Then logout and login again
```

### "No space left on device"

```bash
# Clean up Docker
docker system prune -af
docker volume prune -f

# Check disk usage
df -h

# Remove old images
docker image prune -a
```

### Container keeps restarting

```bash
# Check logs
docker logs portfolio --tail 100

# Check container health
docker inspect portfolio | grep -A 10 Health

# Common causes:
# - Application crash on startup
# - Health check failing
# - Missing environment variables
```

---

## Nginx Issues

### "502 Bad Gateway"

**Problem:** Nginx can't reach the upstream (Docker container).

**Solutions:**

1. **Check if container is running:**
   ```bash
   docker ps | grep portfolio
   ```

2. **Check if port mapping is correct:**
   ```bash
   # Container should be on port 3000
   curl localhost:3000/health
   ```

3. **Check Nginx upstream config:**
   ```bash
   cat /etc/nginx/conf.d/portfolio.conf
   # Should have: proxy_pass http://127.0.0.1:3000;
   ```

4. **Check Nginx error logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

### "Connection refused"

```bash
# Check if Nginx is running
sudo systemctl status nginx

# Start Nginx
sudo systemctl start nginx

# Check Nginx config
sudo nginx -t
```

### "Too many redirects"

**Problem:** Redirect loop, usually SSL related.

**Solution:**
```bash
# Check if both HTTP and HTTPS servers are configured correctly
cat /etc/nginx/conf.d/portfolio.conf

# Make sure redirect only happens on HTTP, not HTTPS
```

---

## SSL/TLS Issues

### "Certificate not found" after Certbot

```bash
# Check if certificates exist
sudo ls -la /etc/letsencrypt/live/yourdomain.com/

# If not, run Certbot again
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Certificate expired

```bash
# Check certificate expiry
sudo certbot certificates

# Renew manually
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

### "DNS problem: NXDOMAIN"

**Problem:** Domain not resolving to your server.

**Solution:**
1. Check Route 53 A record points to EC2 Elastic IP
2. Wait for DNS propagation (can take 24-48 hours)
3. Check with: `dig yourdomain.com`

---

## Quick Diagnostics Script

Run this on EC2 to check system status:

```bash
#!/bin/bash
echo "=== System Status ==="
echo ""

echo "Docker:"
docker ps
echo ""

echo "Docker Container Health:"
docker inspect portfolio --format='{{.State.Health.Status}}' 2>/dev/null || echo "Container not found"
echo ""

echo "Nginx:"
sudo systemctl status nginx --no-pager | head -5
echo ""

echo "Ports:"
sudo netstat -tlnp | grep -E "(80|443|3000)"
echo ""

echo "Disk Space:"
df -h /
echo ""

echo "Memory:"
free -h
echo ""

echo "Health Check (Container):"
curl -s localhost:3000/health
echo ""

echo "Health Check (Nginx):"
curl -s localhost:80/health
echo ""
```

---

## Getting Help

1. **Check CloudWatch Logs:**
   - AWS Console > CloudWatch > Log groups > /portfolio/prod

2. **Check EC2 instance logs:**
   ```bash
   sudo cat /var/log/user-data.log
   sudo cat /var/log/cloud-init-output.log
   ```

3. **Gather info for support:**
   ```bash
   # On EC2
   docker logs portfolio > /tmp/docker-logs.txt
   sudo journalctl -u nginx > /tmp/nginx-logs.txt
   sudo journalctl -u docker > /tmp/docker-service-logs.txt
   ```

4. **Terraform state issues:**
   ```bash
   # Show current state
   terraform show

   # Refresh state from AWS
   terraform refresh
   ```
