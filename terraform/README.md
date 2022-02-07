- Make a new directory and go in it.
- Make a file name it: `main.tf`
- Find your provider `https://registry.terraform.io/providers`
- Open documentation page
- Follow instructions to set the provider up. 
- For example to setup AWS provider. Add the following to main.tf:
```
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "us-east-1"
}
```
- Also add the following Env variables:
```
$ export AWS_ACCESS_KEY_ID="anaccesskey"
$ export AWS_SECRET_ACCESS_KEY="asecretkey"
```
- To setup your providers `terraform init`
- To see what changes are pending run `terraform.plan`
- To apply changes `terraform apply`
- To pull the state `terraform state pull`
- There also is a `terraform state push` which can be used when statefile is out of sync. BE CAREFUL. running this is dangerous.
- How to make an ECS cluster using terraform: 
  - Tutorial: https://testdriven.io/blog/deploying-django-to-ecs-with-terraform
  - Code: https://github.com/testdrivenio/django-ecs-terraform/tree/master/terraform

