---
title: "Suppress/Skip"
slug: "suppress"
hidden: false
createdAt: "2021-03-16T10:54:10.532Z"
updatedAt: "2021-03-22T15:53:59.345Z"
---
# Suppressions

Like any static-analysis tool, suppression is limited by its analysis scope.
For example, if a resource is managed manually, or using configuration management tools, a suppression can be inserted as a simple code annotation.

## Suppression Comment Format

To skip a check on a given Terraform definition block or CloudFormation resource, apply the following comment pattern inside its scope:
`checkov:skip=<check_id>:<suppression_comment>`
* `<check_id>` is one of the available check scanners.
* `<suppression_comment>` is an optional suppression reason to be included in the output.

### Example
The following comment skips the `CKV_AWS_20` check on the resource identified by `foo-bucket`, where the scan checks if an AWS S3 bucket is private.
In the example, the bucket is configured with a public read access; Adding the suppress comment skips the appropriate check instead of the check failing.
[block:code]
{
  "codes": [
    {
      "code": "resource \"aws_s3_bucket\" \"foo-bucket\" {\n  region        = var.region\n    #checkov:skip=CKV_AWS_20:The bucket is a public static content host\n  bucket        = local.bucket_name\n  force_destroy = true\n  acl           = \"public-read\"\n}",
      "language": "python",
      "name": " "
    }
  ]
}
[/block]
The output now contains a ``SKIPPED`` check result entry:
[block:code]
{
  "codes": [
    {
      "code": "...\n...\nCheck: \"S3 Bucket has an ACL defined which allows public access.\"\n\tSKIPPED for resource: aws_s3_bucket.foo-bucket\n\tSuppress comment: The bucket is a public static content host\n\tFile: /example_skip_acl.tf:1-25\n\n...",
      "language": "python",
      "name": " "
    }
  ]
}
[/block]
### Kubernetes Example
To suppress checks in Kubernetes manifests, annotations are used with the following format:
`checkov.io/skip#: <check_id>=<suppression_comment>`
[block:code]
{
  "codes": [
    {
      "code": "apiVersion: v1\nkind: Pod\nmetadata:\n  name: mypod\n  annotations:\n    checkov.io/skip1: CKV_K8S_20=I don't care about Privilege Escalation :-O\n    checkov.io/skip2: CKV_K8S_14\n    checkov.io/skip3: CKV_K8S_11=I have not set CPU limits as I want BestEffort QoS\nspec:\n  containers:\n...",
      "language": "yaml",
      "name": " "
    }
  ]
}
[/block]