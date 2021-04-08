---
title: "Scan Terraform Plan"
slug: "scan-terraform-plan-1"
hidden: false
createdAt: "2021-03-11T21:37:48.221Z"
updatedAt: "2021-03-11T21:40:16.473Z"
---
# Evaluate Checkov Policies on Terraform Plan
Checkov supports the evaluation of policies on resources declared in `.tf` files. It can also be used to evaluate `terraform plan` expressed in a json file. Plan evaluation provides Checkov additional dependencies and context that can result in a more complete scan result. Since Terraform plan files may contain arguments (like secrets) that are injected dynamically, it is advised to run a plan evaluation using Checkov in a secure CI/CD pipeline setting.

## Example
[block:code]
{
  "codes": [
    {
      "code": "terraform init\nterraform plan --out tfplan.binary\nterraform show -json tfplan.binary > tfplan.json\n\ncheckov -f tfplan.json",
      "language": "json"
    }
  ]
}
[/block]
### Example output:
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/6032f68-checkov_terraform_plan.png",
        "checkov_terraform_plan.png",
        1248,
        1524,
        "#313130"
      ]
    }
  ]
}
[/block]