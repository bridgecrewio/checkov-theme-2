---
title: "Reviewing Scan Results"
slug: "cli-json-junit"
hidden: false
createdAt: "2021-03-16T10:55:19.711Z"
updatedAt: "2021-03-22T15:50:52.478Z"
---
#View Scan Results

The results of Checkov scans can be viewed in CLI, JSON or JUnit

## Scan Result Sample (CLI)

Consider the following Terraform configuration of an S3 bucket:
[block:code]
{
  "codes": [
    {
      "code": "resource \"aws_s3_bucket\" \"foo-bucket\" {\n  region        = var.region\n  bucket        = local.bucket_name\n  force_destroy = true\n\n  tags = {\n    Name = \"foo-${data.aws_caller_identity.current.account_id}\"\n  }\n  versioning {\n    enabled = true\n  }\n  logging {\n    target_bucket = \"${aws_s3_bucket.log_bucket.id}\"\n    target_prefix = \"log/\"\n  }\n  server_side_encryption_configuration {\n    rule {\n      apply_server_side_encryption_by_default {\n        kms_master_key_id = \"${aws_kms_key.mykey.arn}\"\n        sse_algorithm     = \"aws:kms\"\n      }\n    }\n  }\n  acl           = \"private\"\n}",
      "language": "python",
      "name": "S3 Bucket Configuration (Compliant)"
    }
  ]
}
[/block]
The appropriate output report is:
[block:code]
{
  "codes": [
    {
      "code": "Passed checks: 4, Failed checks: 0, Skipped checks: 0\n\nCheck: \"Ensure all data stored in the S3 bucket is securely encrypted at rest\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\nCheck: \"Ensure the S3 bucket has access logging enabled\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\nCheck: \"Ensure all data stored in the S3 bucket have versioning enabled\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\nCheck: \"S3 Bucket has an ACL defined which allows public access.\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25",
      "language": "python",
      "name": "Scab Report - No Failures"
    }
  ]
}
[/block]
The bucket's current configuration seems to comply with the available ``aws_s3_bucket`` resource type checks.

However, if the bucket is going to be used for static content hosting, it requires additional configuration to allow public access:
[block:code]
{
  "codes": [
    {
      "code": "resource \"aws_s3_bucket\" \"foo-bucket\" {\n  region        = var.region\n  bucket        = local.bucket_name\n  force_destroy = true\n\n  tags = {\n    Name = \"foo-${data.aws_caller_identity.current.account_id}\"\n  }\n  versioning {\n    enabled = true\n  }\n  logging {\n    target_bucket = \"${aws_s3_bucket.log_bucket.id}\"\n    target_prefix = \"log/\"\n  }\n  server_side_encryption_configuration {\n    rule {\n      apply_server_side_encryption_by_default {\n        kms_master_key_id = \"${aws_kms_key.mykey.arn}\"\n        sse_algorithm     = \"aws:kms\"\n      }\n    }\n  }\n  acl           = \"public-read\"\n}\ndata \"aws_caller_identity\" \"current\" {}",
      "language": "python",
      "name": "S3 Bucket Configuration (Non-compliant)"
    }
  ]
}
[/block]
After configuring the bucket to allow public access, the output report contains the failed check:
[block:code]
{
  "codes": [
    {
      "code": "Passed checks: 3, Failed checks: 1, Skipped checks: 0\n\nCheck: \"Ensure all data stored in the S3 bucket is securely encrypted at rest\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\nCheck: \"Ensure the S3 bucket has access logging enabled\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\nCheck: \"Ensure all data stored in the S3 bucket have versioning enabled\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\nCheck: \"S3 Bucket has an ACL defined which allows public access.\"\n\tFAILED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\t\t1 | resource \"aws_s3_bucket\" \"foo-bucket\" {\n\t\t2 |   region        = var.region\n\t\t3 |   bucket        = local.bucket_name\n\t\t4 |   force_destroy = true\n\t\t5 |\n\t\t6 |   tags = {\n\t\t7 |     Name = \"foo-${data.aws_caller_identity.current.account_id}\"\n\t\t8 |   }\n\t\t9 |   versioning {\n\t\t10 |     enabled = true\n\t\t11 |   }\n\t\t12 |   logging {\n\t\t13 |     target_bucket = \"${aws_s3_bucket.log_bucket.id}\"\n\t\t14 |     target_prefix = \"log/\"\n\t\t15 |   }\n\t\t16 |   server_side_encryption_configuration {\n\t\t17 |     rule {\n\t\t18 |       apply_server_side_encryption_by_default {\n\t\t19 |         kms_master_key_id = \"${aws_kms_key.mykey.arn}\"\n\t\t20 |         sse_algorithm     = \"aws:kms\"\n\t\t21 |       }\n\t\t22 |     }\n\t\t23 |   }\n\t\t24 |   acl           = \"public-read\"\n\t\t25 | }",
      "language": "python",
      "name": "Scan Output - with Failures"
    }
  ]
}
[/block]
The corresponding check now fails, and the report includes the appropriate failing configuration source code.

In order to skip the failed check, we annotate the bucket with a suppression comment (which needs to appear inside the resource scope):
[block:code]
{
  "codes": [
    {
      "code": "resource \"aws_s3_bucket\" \"foo-bucket\" {\n  # checkov:skip=CKV_AWS_20:The bucket is a public static content host\n  region        = var.region\n  bucket        = local.bucket_name\n  force_destroy = true\n  tags = {\n    Name = \"foo-${data.aws_caller_identity.current.account_id}\"\n  }\n  versioning {\n    enabled = true\n  }\n  logging {\n    target_bucket = \"${aws_s3_bucket.log_bucket.id}\"\n    target_prefix = \"log/\"\n  }\n  server_side_encryption_configuration {\n    rule {\n      apply_server_side_encryption_by_default {\n        kms_master_key_id = \"${aws_kms_key.mykey.arn}\"\n        sse_algorithm     = \"aws:kms\"\n      }\n    }\n  }\n  acl           = \"public-read\"\n}",
      "language": "python"
    }
  ]
}
[/block]
Checkov then skips the ``CKV_AWS_20`` check, and the output report is:
[block:code]
{
  "codes": [
    {
      "code": "Passed checks: 3, Failed checks: 0, Skipped checks: 1\n\nCheck: \"Ensure all data stored in the S3 bucket is securely encrypted at rest\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\nCheck: \"Ensure the S3 bucket has access logging enabled\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\nCheck: \"Ensure all data stored in the S3 bucket have versioning enabled\"\n\tPASSED for resource: aws_s3_bucket.foo-bucket\n\tFile: /example.tf:1-25\n\n\nCheck: \"S3 Bucket has an ACL defined which allows public access.\"\n\tSKIPPED for resource: aws_s3_bucket.foo-bucket\n\tSuppress comment: The bucket is a public static content host\n\tFile: /example.tf:1-25",
      "language": "python"
    }
  ]
}
[/block]