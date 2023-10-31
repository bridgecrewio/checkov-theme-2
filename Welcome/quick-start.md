---
title: "Quick Start"
slug: "quick-start"
hidden: false
createdAt: "2021-03-15T13:43:09.039Z"
updatedAt: "2021-03-22T15:47:16.215Z"
layout: default
nav_order: 2
---
#Getting Started
This Quick Start guide shows the procedures for installing Checkov, running a scan and viewing the results.
See the [CLI Reference](doc:cli-command-reference) and the rest of this documentation for more advanced options.

#Install Checkov from PyPI
[block:code]
{
  "codes": [
    {
      "code": "pip install checkov",
      "language": "text"
    }
  ]
}
[/block]
#Select Input Folder and Scan
Use the command below to indicate the folder that contains your Terraform plan files and run a scan.
[block:code]
{
  "codes": [
    {
      "code": "checkov -d /user/tf",
      "language": "text"
    }
  ]
}
[/block]
#Example
##S3 Bucket Configuration (Compliant)
Consider the configuration of an S3 bucket as represented in the Terraform sample below.
[block:code]
{
  "codes": [
    {
      "code": "resource \"aws_s3_bucket\" \"foo-bucket\" {\n  region        = var.region\n  bucket        = local.bucket_name\n  force_destroy = true\n\n  tags = {\n    Name = \"foo-${data.aws_caller_identity.current.account_id}\"\n  }\n  versioning {\n    enabled = true\n  }\n  logging {\n    target_bucket = \"${aws_s3_bucket.log_bucket.id}\"\n    target_prefix = \"log/\"\n  }\n  server_side_encryption_configuration {\n    rule {\n      apply_server_side_encryption_by_default {\n        kms_master_key_id = \"${aws_kms_key.mykey.arn}\"\n        sse_algorithm     = \"aws:kms\"\n      }\n    }\n  }\n  acl           = \"private\"\n}",
      "language": "yaml",
      "name": "S3 Bucket Configuration (Compliant)"
    }
  ]
}
[/block]
##Scan Output
The scan output would be:
[block:code]
{
  "codes": [
    {
      "code": "Passed checks: 4, Failed checks: 0, Skipped checks: 0\n\nCheck: \"Ensure all data stored in the S3 bucket is securely encrypted at rest\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\nCheck: \"Ensure the S3 bucket has access logging enabled\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\nCheck: \"Ensure all data stored in the S3 bucket have versioning enabled\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\nCheck: \"S3 Bucket has an ACL defined which allows public access.\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25",
      "language": "xml",
      "name": "Scan Output - No Failures"
    }
  ]
}
[/block]
The configuration complies with the policies for AWS S3 resources.

##S3 Bucket Configuration (Non-Compliant)
Suppose that now the same bucket is configured to allow public access:
[block:code]
{
  "codes": [
    {
      "code": "resource \"aws_s3_bucket\" \"foo-bucket\" {\n#same resource configuration as previous example, but acl set for public access.\n  \n  acl           = \"public-read\"\n}\ndata \"aws_caller_identity\" \"current\" {}",
      "language": "yaml",
      "name": "S3 Bucket Configuration (Non-Compliant)"
    }
  ]
}
[/block]
##Scan Output
The output report would then contain a failed check:
[block:code]
{
  "codes": [
    {
      "code": "Passed checks: 3, Failed checks: 1, Skipped checks: 0\n\nCheck: \"Ensure all data stored in the S3 bucket is securely encrypted at rest\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\nCheck: \"Ensure the S3 bucket has access logging enabled\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\nCheck: \"Ensure all data stored in the S3 bucket have versioning enabled\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\nCheck: \"S3 Bucket has an ACL defined which allows public access.\"\n\tFAILED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\t\t1 | resource \"aws_s3_bucket\" \"foo-bucket\" {\n\t\t2 |   region        = var.region\n\t\t3 |   bucket        = local.bucket_name\n\t\t4 |   force_destroy = true\n\t\t5 |\n\t\t6 |   tags = {\n\t\t7 |     Name = \"foo-${data.aws_caller_identity.current.account_id}\"\n\t\t8 |   }\n\t\t9 |   versioning {\n\t\t10 |     enabled = true\n\t\t11 |   }\n\t\t12 |   logging {\n\t\t13 |     target_bucket = \"${aws_s3_bucket.log_bucket.id}\"\n\t\t14 |     target_prefix = \"log/\"\n\t\t15 |   }\n\t\t16 |   server_side_encryption_configuration {\n\t\t17 |     rule {\n\t\t18 |       apply_server_side_encryption_by_default {\n\t\t19 |         kms_master_key_id = \"${aws_kms_key.mykey.arn}\"\n\t\t20 |         sse_algorithm     = \"aws:kms\"\n\t\t21 |       }\n\t\t22 |     }\n\t\t23 |   }\n\t\t24 |   acl           = \"public-read\"\n\t\t25 | }",
      "language": "xml",
      "name": "Scan Output - with Failures"
    }
  ]
}
[/block]
#Visualizing Scan Output
In addition to the various formats for seeing scan results (for example, CLI), you can also visualize Checkov results with a quick integration with Prisma Cloud. See [Visualizing Scan Results](doc:visualizing-scan-results).
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/c267202-ae875bb-bc_api_key.gif",
        "ae875bb-bc_api_key.gif",
        1296,
        817,
        "#bdb5d9"
      ]
    }
  ]
}
[/block]
#Integrations
You can also integrate Checkov with:
  * [Jenkins](doc:jenkins) 
  * [Bitbucket Cloud Pipelines](doc:bitbucket-cloud-pipelines) 
  * [Github Actions](doc:github-actions) 
  * [Gitlab CLI](doc:gitlab-cli) 
  * [Kubernetes](doc:kubernetes) 
  * [Terraform Plans](doc:scan-terraform-plan-1)  
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/855cc43-integrations.png",
        "integrations.png",
        851,
        395,
        "#d1d1e7"
      ]
    }
  ]
}
[/block]
#Add-Ons
Check out the integration with [Visual Studio](https://marketplace.visualstudio.com/items?itemName=Bridgecrew.checkov)

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/763fa25-vs_code.png",
        "vs code.png",
        300,
        168,
        "#eaf4fb"
      ]
    }
  ]
}
[/block]
and coming soon:
An upcoming release of Checkov will include support for IntelliJ IDE.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/e4e362c-intellij-idea-tutorial.png",
        "intellij-idea-tutorial.png",
        250,
        250,
        "#725680"
      ]
    }
  ]
}
[/block]