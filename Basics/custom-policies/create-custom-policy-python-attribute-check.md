---
title: "Create Custom Policy - Python - Attribute Check"
slug: "create-custom-policy-python-attribute-check"
hidden: false
createdAt: "2021-03-17T07:45:46.851Z"
updatedAt: "2021-03-18T15:08:42.305Z"
---
# Writing a New Policy

A policy needs to specify *name*, *ID*, *relevant resources* and *categories*.
[block:parameters]
{
  "data": {
    "h-0": "Parameter",
    "h-1": "Description",
    "h-2": "Example/Comments",
    "0-0": "``name``",
    "0-1": "A new policy's unique purpose.\nIt should ideally specify the positive desired outcome of the policy.",
    "1-0": "``id``",
    "1-1": "A mandatory unique identifier of a policy.\nNative policies written by Bridgecrew contributors will follow the following convention:\n``CKV_providerType_serialNumber``",
    "1-2": "`CKV_AWS_9` ,\n`CKV_GCP_12`",
    "2-0": "``supported_resources``",
    "2-1": "Infrastructure objects, as described in the scanned IaC's language.\nThis usually contains one specific resource block.\nIf you support multiple resources, you can use `*` to match any type of entity in that specific domain.",
    "3-0": "``categories``",
    "3-1": "Categorization of a scan.\nUsually used to produce compliance reports, pipeline analytics and infrastructure health metrics, etc.",
    "2-2": "- `*` use depends on which check base class you extend. See note below table.\n- `?ws_*` will match anything where the second character is a `'w'`, the third is a `'s'` and the fourth is a `'_'`."
  },
  "cols": 3,
  "rows": 4
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "Note for Supported Resources Parameter",
  "body": "If you extend `checkov.terraform.checks.resource.base_resource_check.BaseResourceCheck`, the check is registered for all terraform resources."
}
[/block]
The following example produces a policy that ensures that new RDS services spun-up are encrypted at rest, given a scanned Terraform configuration ([CKV_AWS_16](https://github.com/bridgecrewio/checkov/blob/master/checkov/terraform/checks/resource/aws/RDSEncryption.py)).
1. Create a new file in the AWS check directory ``checkov/terraform/checks/resource/aws/RDSEncryption.py``.
2. Import the following:
[block:code]
{
  "codes": [
    {
      "code": "from checkov.common.models.enums import CheckResult, CheckCategories\nfrom checkov.terraform.checks.resource.base_resource_check import BaseResourceCheck",
      "language": "python",
      "name": " "
    }
  ]
}
[/block]
3. Define the meta entities for this check as described in the table above.
[block:code]
{
  "codes": [
    {
      "code": "class RDSEncryption(BaseResourceCheck):\n    def __init__(self):\n        name = \"Ensure all data stored in the RDS is securely encrypted at rest\"\n        id = \"CKV_AWS_16\"\n        supported_resources = ['aws_db_instance']\n        categories = [CheckCategories.ENCRYPTION]\n        super().__init__(name=name, id=id, categories=categories, supported_resources=supported_resources)",
      "language": "python",
      "name": " "
    }
  ]
}
[/block]
4. Define a simple check of the ```aws_db_instance``` resource block to determine if ```aws_db_instance``` is disabled. If it is disabled, that needs to cause a ```CheckResult.FAILED``` to occur.
[block:code]
{
  "codes": [
    {
      "code": "def scan_resource_conf(self, conf):\n    \"\"\"\n        Looks for encryption configuration at aws_db_instance:\n        https://www.terraform.io/docs/providers/aws/d/db_instance.html\n    :param conf: aws_db_instance configuration\n    :return: <CheckResult>\n    \"\"\"\n    if 'storage_encrypted' in conf.keys():\n        key = conf['storage_encrypted'][0]\n        if key:\n            return CheckResult.PASSED\n    return CheckResult.FAILED",
      "language": "python",
      "name": " "
    }
  ]
}
[/block]
5. Conclude the policy name and operationalize it with the statement:
[block:code]
{
  "codes": [
    {
      "code": "check = RDSEncryption()",
      "language": "python",
      "name": " "
    }
  ]
}
[/block]
## Run a New Scan

To run a scan with the new policy, use the ```checkov``` command.
[block:code]
{
  "codes": [
    {
      "code": "checkov -d /user/tf",
      "language": "python",
      "name": " "
    }
  ]
}
[/block]

#Working with Custom Policies

Checkov is delivered with a set of built-in policies that check for compliance and security best practices at its core. In addition, Checkov enables you to load additional checks, that give the user the ability to author and execute custom policies.

## Example 
This example uses the following directory structure:
[block:code]
{
  "codes": [
    {
      "code": "├── main.tf\n├── variables.tf\n└── outputs.tf",
      "language": "text"
    }
  ]
}
[/block]
The example assumes a unique need to enforce bucket ACL policies only when the tag `Scope=PCI` is present.  That being the case, the following bucket definition must trigger a failed check result:
[block:code]
{
  "codes": [
    {
      "code": "# Snippet from  main.tf\nresource \"aws_s3_bucket\" \"credit_cards_bucket\" {\n  region        = var.region\n  bucket        = local.bucket_name\n  acl           = \"public-read\"\n  force_destroy = true\n\n  tags = {\n    Scope = \"PCI\",\n    \n  }\n}",
      "language": "python",
      "name": " "
    }
  ]
}
[/block]
To trigger the failed check result, you need to add a new check to ensure PCI related S3 buckets will stay private.
1. Create a new python folder named `my_extra_checks` containing the new check:
[block:code]
{
  "codes": [
    {
      "code": "├── main.tf\n├── variables.tf\n└── outputs.tf\n└── my_extra_checks\n    └── __init__.py\n    └── S3PCIPrivateACL.py",
      "language": "text",
      "name": " "
    }
  ]
}
[/block]
  a. The first time you setup the custom checks folder, you need to also create a file named `__init__.py`.
[block:code]
{
  "codes": [
    {
      "code": "from os.path import dirname, basename, isfile, join\nimport glob\nmodules = glob.glob(join(dirname(__file__), \"*.py\"))\n__all__ = [ basename(f)[:-3] for f in modules if isfile(f) and not f.endswith('__init__.py')]",
      "language": "python",
      "name": " "
    }
  ]
}
[/block]
  b. Complete the matching logic in `S3PCIPrivateACL.py`:
[block:code]
{
  "codes": [
    {
      "code": "from lark import Token\n\nfrom checkov.terraform.checks.resource.base_resource_check import BaseResourceCheck\nfrom checkov.common.models.enums import CheckResult, CheckCategories\n\n\nclass S3PCIPrivateACL(BaseResourceCheck):\n    def __init__(self):\n        name = \"Ensure PCI Scope buckets has private ACL (enable public ACL for non-pci buckets)\"\n        id = \"CKV_AWS_999\"\n        supported_resources = ['aws_s3_bucket']\n        # CheckCategories are defined in models/enums.py\n        categories = [CheckCategories.BACKUP_AND_RECOVERY]\n        super().__init__(name=name, id=id, categories=categories, supported_resources=supported_resources)\n\n    def scan_resource_conf(self, conf):\n        \"\"\"\n            Looks for ACL configuration at aws_s3_bucket and Tag values:\n            https://www.terraform.io/docs/providers/aws/r/s3_bucket.html\n        :param conf: aws_s3_bucket configuration\n        :return: <CheckResult>\n        \"\"\"\n        if 'tags' in conf.keys():\n            environment_tag = Token(\"IDENTIFIER\", \"Scope\")\n            if environment_tag in conf['tags'][0].keys():\n                if conf['tags'][0][environment_tag] == \"PCI\":\n                    if 'acl' in conf.keys():\n                        acl_block = conf['acl']\n                        if acl_block in [[\"public-read\"], [\"public-read-write\"], [\"website\"]]:\n                            return CheckResult.FAILED\n        return CheckResult.PASSED\n\n\nscanner = S3PCIPrivateACL()",
      "language": "python",
      "name": " "
    }
  ]
}
[/block]
2. With the new custom check in place, run Checkov and verify the results:
[block:code]
{
  "codes": [
    {
      "code": "# install from pypi using pip\npip install checkov\n\n\n# select an input folder that contains your terraform files and enable loading of extra checks\ncheckov -d . --external-checks-dir my_extra_checks",
      "language": "python",
      "name": " "
    }
  ]
}
[/block]
##Result
[block:code]
{
  "codes": [
    {
      "code": "Check: \"Ensure PCI Scope buckets has private ACL (enable public ACL for non-pci buckets)\"\n\tFAILED for resource: aws_s3_bucket.credit_cards_bucket\n\tFile: /main.tf:80-90\n\n\t\t80 | resource \"aws_s3_bucket\" \"credit_cards_bucket\" {\n\t\t81 | region        = var.region\n\t\t82 | bucket        = local.bucket_name\n\t\t83 | acl           = \"public-read\"\n\t\t84 | force_destroy = true\n\t\t85 | \n\t\t86 | tags = {\n\t\t87 | Scope = \"PCI\",\n\t\t88 | \n\t\t89 | }\n\t\t90 | }",
      "language": "python"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "title": "Attention",
  "body": "Policies can not share the same file name. If two policies with the same file name exist, only the first one will be loaded."
}
[/block]