---
title: "Scan 3rd Party Terraform Module"
slug: "scan-3rd-party-terraform-module-1"
hidden: false
createdAt: "2021-03-11T21:37:56.876Z"
updatedAt: "2021-03-11T21:43:09.975Z"
layout: default
---
# Scanning third party Terraform modules
Third party Terraform modules often reduce complexity for deploying services made up of many objects.

For example, the third party EKS module by howdio reduces the terraform required to the nine lines below, however, in doing so abstracts the terraform configuration away from a regular Checkov scan on the current directory.
[block:code]
{
  "codes": [
    {
      "code": "module \"eks\" {\n  source = \"howdio/eks/aws\"\n\n  name        = \"examplecluster\"\n  default_vpc = true\n\n  enable_kubectl   = true\n  enable_dashboard = true\n}",
      "language": "python"
    }
  ]
}
[/block]
To ensure coverage of objects within these modules, you can instruct checkov to scan the `.terraform` directory, after a `terraform init`, which will have retrieved the third party modules and any associated `.tf` files.
[block:code]
{
  "codes": [
    {
      "code": "terraform init\ncheckov -d . # Your TF files.\ncheckov -d .terraform # Module TF files.",
      "language": "python"
    }
  ]
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/152f800-scanning-terraform-module.png",
        "scanning-terraform-module.png",
        2108,
        1084,
        "#050707"
      ]
    }
  ]
}
[/block]
It is worth noting however, when scanning the `.terraform` directory, Checkov cannot differentiate between third party and internally written modules, however, you will gain scanning coverage for all of them.