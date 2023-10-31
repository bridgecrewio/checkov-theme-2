---
title: "Create Custom Policy - Python - Attribute Check_OLD"
slug: "create-custom-policy-basic"
hidden: true
createdAt: "2021-03-11T14:28:51.732Z"
updatedAt: "2021-03-17T11:13:06.496Z"
---
# Writing a new Policy

A policy needs to specify the following items:

- ``name`` : A new policy's unique purpose; It should ideally specify the positive desired outcome of the policy.
- ``id``: A mandatory unique identifier of a policy; Native policies written by Checkov contributors will follow the following convention ``CKV_providerType_serialNumber``. (e.g. `CKV_AWS_9` , `CKV_GCP_12`)
- ``supported_resources``: Infrastructure objects, as described in the scanned IaC's language; This should usually contain one specific resource block. If you support multiple resources, you can use `*` to match any type of entity in that specific domain. (This depends on which check base class you extend. If you extend `checkov.terraform.checks.resource.base_resource_check.BaseResourceCheck`, the check is registered for all terraform resources.) `?ws_*` will match anything where the second character is a `'w'`, the third is a `'s'` and the fourth is a `'_'`.
- ``categories``: Categorization of a scan; usually used to produce compliance reports, pipeline analytics and infrastructure health metrics, etc.

For this tutorial let's produce a policy that ensures that new RDS services spun-up are encrypted at rest, given a scanned Terraform configuration ([CKV_AWS_16](https://github.com/bridgecrewio/checkov/blob/master/checkov/terraform/checks/resource/aws/RDSEncryption.py)).
1. Start by creating a new file in the AWS check directory ``checkov/terraform/checks/resource/aws/RDSEncryption.py``.
2. Import the following:
[block:code]
{
  "codes": [
    {
      "code": "from checkov.common.models.enums import CheckResult, CheckCategories\nfrom checkov.terraform.checks.resource.base_resource_check import BaseResourceCheck",
      "language": "python"
    }
  ]
}
[/block]
3. At this point, we define the meta entities for this check: ``name``, ``id``, ``supported_resources``, ``categories``
[block:code]
{
  "codes": [
    {
      "code": "class RDSEncryption(BaseResourceCheck):\n    def __init__(self):\n        name = \"Ensure all data stored in the RDS is securely encrypted at rest\"\n        id = \"CKV_AWS_16\"\n        supported_resources = ['aws_db_instance']\n        categories = [CheckCategories.ENCRYPTION]\n        super().__init__(name=name, id=id, categories=categories, supported_resources=supported_resources)",
      "language": "python"
    }
  ]
}
[/block]
4. Next we define a simple check of the ```aws_db_instance``` resource block to find if ```aws_db_instance``` is disabled. When disabled, we require it will result in a ```CheckResult.FAILURE```.
[block:code]
{
  "codes": [
    {
      "code": "def scan_resource_conf(self, conf):\n    \"\"\"\n        Looks for encryption configuration at aws_db_instance:\n        https://www.terraform.io/docs/providers/aws/d/db_instance.html\n    :param conf: aws_db_instance configuration\n    :return: <CheckResult>\n    \"\"\"\n    if 'storage_encrypted' in conf.keys():\n        key = conf['storage_encrypted'][0]\n        if key:\n            return CheckResult.PASSED\n    return CheckResult.FAILED",
      "language": "python"
    }
  ]
}
[/block]
5. Last - our file should conclude the policy name and operationalize it with this statement.
[block:code]
{
  "codes": [
    {
      "code": "check = RDSEncryption()",
      "language": "python"
    }
  ]
}
[/block]
## Run a new scan

To run a new scan containing our newly added policy, use the ```checkov``` command.
[block:code]
{
  "codes": [
    {
      "code": "checkov -d /user/tf",
      "language": "python"
    }
  ]
}
[/block]