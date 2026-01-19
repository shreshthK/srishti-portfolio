# Srishti Rawat - Portfolio Website

A modern, responsive portfolio website showcasing professional experience, skills, and achievements. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Responsive Design**: Fully responsive layout that works seamlessly across all devices
- **Dark/Light Theme**: Toggle between dark and light themes for better user experience
- **Smooth Animations**: Interactive animations powered by Framer Motion
- **Scroll Spy Navigation**: Active section highlighting in the navigation bar
- **Modern UI/UX**: Clean, professional design with smooth transitions
- **Performance Optimized**: Fast loading times with Vite build tool
- **Docker Support**: Easy deployment with Docker and Nginx

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Linting**: ESLint
- **Deployment**: Docker + Nginx

## 📋 Prerequisites

- Node.js (v20 or higher recommended)
- npm or yarn
- Docker (optional, for containerized deployment)

## 🏃 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd srishti-portfolio
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

### Building for Production

Build the application:
```bash
npm run build
```

The production-ready files will be generated in the `dist/` directory.

Preview the production build locally:
```bash
npm run preview
```

### Linting

Run ESLint to check for code quality issues:
```bash
npm run lint
```

## 🚀 AWS Deployment

This project includes a complete CI/CD pipeline for deploying to AWS EC2.

### Infrastructure Overview

- **Terraform**: Infrastructure as Code for AWS resources (VPC, EC2, ECR, IAM)
- **Ansible**: Configuration management for EC2 instance setup
- **GitHub Actions**: CI/CD pipelines for automated testing and deployment
- **AWS Services**: EC2, ECR, CloudWatch, Route 53

### Quick Start

See the full deployment guide: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

```bash
# 1. Configure AWS credentials
aws configure

# 2. Deploy infrastructure
cd infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
terraform init && terraform apply

# 3. Configure EC2 with Ansible
cd ../ansible
ansible-playbook playbooks/setup.yml

# 4. Set GitHub Secrets and push to deploy
```

### Infrastructure Files

```
infrastructure/
├── terraform/          # AWS infrastructure as code
│   ├── main.tf         # Provider configuration
│   ├── vpc.tf          # VPC, subnets, internet gateway
│   ├── ec2.tf          # EC2 instance and Elastic IP
│   ├── ecr.tf          # Container registry
│   ├── iam.tf          # IAM roles and policies
│   └── cloudwatch.tf   # Monitoring and logging
├── ansible/            # Configuration management
│   ├── playbooks/      # Setup and deploy playbooks
│   └── roles/          # Docker, Nginx, CloudWatch roles
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. Build and start the containers:
```bash
docker-compose up -d
```

2. The application will be available at `http://localhost:80`

3. Stop the containers:
```bash
docker-compose down
```

### Using Dockerfile

1. Build the Docker image:
```bash
docker build -t srishti-portfolio .
```

2. Run the container:
```bash
docker run -d -p 80:80 srishti-portfolio
```

## 📁 Project Structure

```
srishti-portfolio/
├── src/
│   ├── components/
│   │   ├── animations/      # Animation components
│   │   ├── layout/          # Layout components (Navbar, Footer)
│   │   ├── sections/        # Page sections (Hero, About, Skills, etc.)
│   │   └── ui/              # Reusable UI components
│   ├── context/             # React context providers
│   ├── data/                # Portfolio data and content
│   ├── hooks/               # Custom React hooks
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── dist/                    # Production build output
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose configuration
├── nginx.conf               # Nginx server configuration
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies and scripts
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

To customize the portfolio content, edit the data file:
- `src/data/portfolio-data.ts` - Contains all portfolio information including:
  - Personal information
  - Skills and tools
  - Work experience
  - Education
  - Social links

## 🌐 Sections

The portfolio includes the following sections:

1. **Hero** - Introduction and main call-to-action
2. **About** - Professional bio and statistics
3. **Skills** - Technical skills and soft skills
4. **Experience** - Work history and achievements
5. **Contact** - Contact form and social links

## 📄 License

This project is private and proprietary.

## 👤 Author

**Srishti Rawat**
- LinkedIn: [srishti-rawat-29061996](https://linkedin.com/in/srishti-rawat-29061996)
- Email: srish.rwt29@gmail.com

---

Built with ❤️ using React and TypeScript
