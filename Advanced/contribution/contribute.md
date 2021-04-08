---
title: "Contribute New Provider"
slug: "contribute"
hidden: false
createdAt: "2021-03-11T14:30:10.427Z"
updatedAt: "2021-03-18T13:30:27.821Z"
---
# Contributing a New Provider
In this example we'll add support for a new Terraform Provider, the Linode Cloud platform.

## Add Resource Checks for a New Provider
This check is going to examine resources of the type: `linode_instance`, to ensure they have the property `authorised_keys` set.

### Add a Test
First create a new folder `tests/terraform/checks/resource/linode/` and add `test_authorised_keys.py` using the code below:
[block:code]
{
  "codes": [
    {
      "code": "import unittest\n\nimport hcl2\nfrom checkov.terraform.checks.resource.linode.authorized_keys import check\nfrom checkov.common.models.enums import CheckResult\n\n\nclass Testauthorized_keys(unittest.TestCase):\n\n    def test_success(self):\n        hcl_res = hcl2.loads(\"\"\"\n        resource \"linode_instance\" \"test\" {\n        authorized_keys=\"1234355-12345-12-1213123\"\n        }\n        \"\"\")\n        resource_conf = hcl_res['resource'][0]['linode_instance']['test']\n        scan_result = check.scan_resource_conf(conf=resource_conf)\n        self.assertEqual(CheckResult.PASSED, scan_result)\n\n    def test_failure(self):\n        hcl_res = hcl2.loads(\"\"\"\n        resource \"linode_instance\" \"test\" {\n        }\n        \"\"\")\n        resource_conf = hcl_res['resource'][0]['linode_instance']['test']\n        scan_result = check.scan_resource_conf(conf=resource_conf)\n        self.assertEqual(CheckResult.FAILED, scan_result)\n\nif __name__ == '__main__':\n    unittest.main()",
      "language": "python",
      "name": "Add a Test"
    }
  ]
}
[/block]
Add a placeholder file at `tests/terraform/checks/resource/linode/__init__.py`

```python

```

### Add a Check

Create the folder `checkov/checkov/terraform/checks/resource/linode` and add `authorized_keys.py`:
[block:code]
{
  "codes": [
    {
      "code": "from checkov.common.models.enums import CheckCategories, CheckResult\nfrom checkov.terraform.checks.resource.base_resource_value_check import BaseResourceCheck\n\nclass authorized_keys(BaseResourceCheck):\n    def __init__(self):\n        name = \"Ensure SSH key set in authorized_keys\"\n        id = \"CKV_LIN_2\"\n        supported_resources = ['linode_instance']\n        categories = [CheckCategories.GENERAL_SECURITY]\n        super().__init__(name=name, id=id, categories=categories, supported_resources=supported_resources)\n\n    def scan_resource_conf(self, conf):\n        if 'authorized_keys' in conf:\n            if conf['authorized_keys']:\n                return CheckResult.PASSED\n        return CheckResult.FAILED\n\n\ncheck = authorized_keys() ",
      "language": "python",
      "name": "Add a Check"
    }
  ]
}
[/block]
And also add `checkov/terraform/checks/resource/linode/__init__.py`:
[block:code]
{
  "codes": [
    {
      "code": "from os.path import dirname, basename, isfile, join\nimport glob\nmodules = glob.glob(join(dirname(__file__), \"*.py\"))\n__all__ = [ basename(f)[:-3] for f in modules if isfile(f) and not f.endswith('__init__.py')]",
      "language": "python",
      "name": "Add __init__.py"
    }
  ]
}
[/block]
### Include Checks
In `checkov/terraform/checks/resource/__init__.py`, update include Linode resources with the entry `from checkov.terraform.checks.resource.linode import * `.
This will ensure that this and any future Linode resource test are included in Checkov runs:
[block:code]
{
  "codes": [
    {
      "code": "from checkov.terraform.checks.resource.gcp import *\nfrom checkov.terraform.checks.resource.azure import *\nfrom checkov.terraform.checks.resource.github import *\nfrom checkov.terraform.checks.resource.linode import * ",
      "language": "python",
      "name": "Include Checks"
    }
  ]
}
[/block]
## Add New Provider Checks
This Provider check verifies that the user hasn't added their Linode secret token to their file. Adding the secret token to a Public repository would cause many problems.

### Adding a Test
Create the folder `tests/terraform/checks/provider/linode/` and `test_credentials.py`
[block:code]
{
  "codes": [
    {
      "code": "import unittest\n\nfrom checkov.terraform.checks.provider.linode.credentials import check\nfrom checkov.common.models.enums import CheckResult\n\n\nclass TestCredentials(unittest.TestCase):\n\n    def test_success(self):\n        provider_conf = {}\n\n        scan_result = check.scan_provider_conf(conf=provider_conf)\n        self.assertEqual(CheckResult.PASSED, scan_result)\n\n    def test_failure(self):\n        provider_conf = {'token' :['AKIAIOSFODNN7EXAMPLE']}\n        scan_result = check.scan_provider_conf(conf=provider_conf)\n        self.assertEqual(CheckResult.FAILED, scan_result)\n\nif __name__ == '__main__':\n    unittest.main()",
      "language": "python",
      "name": "Adding a Test"
    }
  ]
}
[/block]
Then add the placeholder `tests/terraform/checks/provider/linode/__init__.py`
```python

```

### Add the Provider Check
Create a directory `checkov/terraform/checks/provider/linode` and add `credentials.py`
[block:code]
{
  "codes": [
    {
      "code": "import re\nfrom checkov.common.models.enums import CheckResult, CheckCategories\nfrom checkov.terraform.checks.provider.base_check import BaseProviderCheck\nfrom checkov.common.models.consts import linode_token_pattern\n\n\nclass LinodeCredentials(BaseProviderCheck):\n\n    def __init__(self):\n        name = \"Ensure no hard coded Linode tokens exist in provider\"\n        id = \"CKV_LIN_1\"\n        supported_provider = ['linode']\n        categories = [CheckCategories.SECRETS]\n        super().__init__(name=name, id=id, categories=categories, supported_provider=supported_provider)\n\n    def scan_provider_conf(self, conf):\n        if self.secret_found(conf, \"token\", linode_token_pattern):\n            return CheckResult.FAILED\n        return CheckResult.PASSED\n\n    @staticmethod\n    def secret_found(conf, field, pattern):\n        if field in conf.keys():\n            value = conf[field][0]\n            if re.match(pattern, value) is not None:\n                return True\n        return False\n\n\ncheck = LinodeCredentials()",
      "language": "python",
      "name": "Add Provider Check"
    }
  ]
}
[/block]
And also `checkov/terraform/checks/provider/linode/__init__.py`
Update the security constants `checkov/common/models/consts.py` with the new pattern.
[block:code]
{
  "codes": [
    {
      "code": "SUPPORTED_FILE_EXTENSIONS = [\".tf\", \".yml\", \".yaml\", \".json\", \".template\"]\nANY_VALUE = \"CKV_ANY\"\nDOCKER_IMAGE_REGEX = r'(?:[^\\s\\/]+/)?([^\\s:]+):?([^\\s]*)'\naccess_key_pattern = \"(?<![A-Z0-9])[A-Z0-9]{20}(?![A-Z0-9])\" # nosec\nsecret_key_pattern = \"(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])\" # nosec\nlinode_token_pattern =\"(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{64}(?![A-Za-z0-9/+=])\" # nosec",
      "language": "python",
      "name": "Update Security Constants"
    }
  ]
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "from os.path import dirname, basename, isfile, join\nimport glob\n\nmodules = glob.glob(join(dirname(__file__), \"*.py\"))\n__all__ = [basename(f)[:-3] for f in modules if isfile(f) and not f.endswith('__init__.py')]",
      "language": "python",
      "name": "Add __init__.py File"
    }
  ]
}
[/block]
### Include the Provider Checks
Update `checkov/terraform/checks/provider/__init__.py` with `from checkov.terraform.checks.provider.linode import *`, making it:
[block:code]
{
  "codes": [
    {
      "code": "from checkov.terraform.checks.provider.aws import *\nfrom checkov.terraform.checks.provider.linode import *",
      "language": "python",
      "name": "Provider Checks"
    }
  ]
}
[/block]
So there you have it, 2 new checks, one for the provider, one for your resource and a newly supported Terraform Provider.