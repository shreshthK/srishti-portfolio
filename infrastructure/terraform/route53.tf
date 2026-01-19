# ============================================================================
# ROUTE 53 DNS CONFIGURATION
# ============================================================================
# Route 53 is AWS's DNS (Domain Name System) service.
# It translates domain names (example.com) to IP addresses.
#
# This file configures DNS records to point your domain to the EC2 instance.
#
# Prerequisites:
# 1. Domain registered in Route 53, OR
# 2. Hosted zone created and nameservers updated at your registrar
#
# Learning Resources:
# - Route 53 Concepts: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/welcome-dns-service.html
# - Terraform Route 53: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record
# ============================================================================

# ----------------------------------------------------------------------------
# DNS Records
# ----------------------------------------------------------------------------
# These resources are only created if you have configured a domain.
# Use the 'count' meta-argument to conditionally create resources.

# A Record - Points domain to EC2's Elastic IP
resource "aws_route53_record" "root" {
  count = var.create_dns_records ? 1 : 0

  zone_id = var.route53_zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300  # 5 minutes (lower for initial setup, increase for production)

  records = [aws_eip.portfolio.public_ip]
}

# CNAME Record - Points www subdomain to root domain
resource "aws_route53_record" "www" {
  count = var.create_dns_records ? 1 : 0

  zone_id = var.route53_zone_id
  name    = "www.${var.domain_name}"
  type    = "CNAME"
  ttl     = 300

  records = [var.domain_name]
}

# ----------------------------------------------------------------------------
# Health Check (Optional)
# ----------------------------------------------------------------------------
# Route 53 can monitor your endpoint and route traffic away from unhealthy ones.
# Useful for failover scenarios (requires multiple endpoints).
#
# TODO: Uncomment for production with health checks

# resource "aws_route53_health_check" "portfolio" {
#   count = var.create_dns_records ? 1 : 0
#
#   fqdn              = var.domain_name
#   port              = 443
#   type              = "HTTPS"
#   resource_path     = "/health"
#   failure_threshold = "3"
#   request_interval  = "30"
#
#   tags = {
#     Name = "${local.name_prefix}-health-check"
#   }
# }

# ----------------------------------------------------------------------------
# SSL Certificate with ACM (Optional)
# ----------------------------------------------------------------------------
# AWS Certificate Manager (ACM) provides free SSL certificates.
# However, for EC2 with Nginx, we'll use Let's Encrypt instead
# (ACM certificates can only be used with AWS load balancers/CloudFront).
#
# If you later add a load balancer, you can use this:
#
# resource "aws_acm_certificate" "portfolio" {
#   count = var.create_dns_records ? 1 : 0
#
#   domain_name               = var.domain_name
#   subject_alternative_names = ["www.${var.domain_name}"]
#   validation_method         = "DNS"
#
#   lifecycle {
#     create_before_destroy = true
#   }
#
#   tags = {
#     Name = "${local.name_prefix}-cert"
#   }
# }
#
# # DNS validation records
# resource "aws_route53_record" "cert_validation" {
#   for_each = var.create_dns_records ? {
#     for dvo in aws_acm_certificate.portfolio[0].domain_validation_options : dvo.domain_name => {
#       name   = dvo.resource_record_name
#       record = dvo.resource_record_value
#       type   = dvo.resource_record_type
#     }
#   } : {}
#
#   zone_id = var.route53_zone_id
#   name    = each.value.name
#   type    = each.value.type
#   ttl     = 60
#   records = [each.value.record]
# }
#
# resource "aws_acm_certificate_validation" "portfolio" {
#   count = var.create_dns_records ? 1 : 0
#
#   certificate_arn         = aws_acm_certificate.portfolio[0].arn
#   validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
# }

# ----------------------------------------------------------------------------
# Domain Registration Notes
# ----------------------------------------------------------------------------
#
# To register a domain via Route 53:
# 1. Go to AWS Console -> Route 53 -> Registered Domains
# 2. Click "Register Domain"
# 3. Search for your desired domain name
# 4. Complete the registration (typically $12/year for .com)
#
# AWS automatically creates a hosted zone when you register a domain.
# Get the Zone ID from Route 53 -> Hosted Zones.
#
# If you have a domain elsewhere:
# 1. Create a Hosted Zone in Route 53 for your domain
# 2. Note the NS (nameserver) records in the hosted zone
# 3. Go to your domain registrar and update nameservers to Route 53's
# 4. Wait 24-48 hours for DNS propagation
# 5. Set the zone_id in Terraform variables
