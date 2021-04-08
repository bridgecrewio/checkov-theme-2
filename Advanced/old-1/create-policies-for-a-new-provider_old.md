---
title: "Create Policies for a New Provider_OLD"
slug: "create-policies-for-a-new-provider_old"
hidden: true
createdAt: "2021-03-18T12:10:55.104Z"
updatedAt: "2021-03-18T12:10:55.104Z"
---
# Overview

This check is going to examine resources of the type: **linode_instance**, to ensure they have the property **authorised_keys** set.

### Add a Test for Custom Policy

First create a new folder **tests/terraform/checks/resource/linode/** and add **test_authorised_keys.py** with this:
[block:code]
{
  "codes": [
    {
      "code": "```python\nimport unittest\n\nimport hcl2\nfrom checkov.terraform.checks.resource.linode.authorized_keys import check\nfrom checkov.common.models.enums import CheckResult\n\n\nclass Testauthorized_keys(unittest.TestCase):\n\n    def test_success(self):\n        hcl_res = hcl2.loads(\"\"\"\n        resource \"linode_instance\" \"test\" {\n        authorized_keys=\"1234355-12345-12-1213123\"\n        }\n        \"\"\")\n        resource_conf = hcl_res['resource'][0]['linode_instance']['test']\n        scan_result = check.scan_resource_conf(conf=resource_conf)\n        self.assertEqual(CheckResult.PASSED, scan_result)\n\n    def test_failure(self):\n        hcl_res = hcl2.loads(\"\"\"\n        resource \"linode_instance\" \"test\" {\n        }\n        \"\"\")\n        resource_conf = hcl_res['resource'][0]['linode_instance']['test']\n        scan_result = check.scan_resource_conf(conf=resource_conf)\n        self.assertEqual(CheckResult.FAILED, scan_result)\n\nif __name__ == '__main__':\n    unittest.main()\n```",
      "language": "python"
    }
  ]
}
[/block]
Add a placeholder file at **tests/terraform/checks/resource/linode/__init__.py**

```python

```

### Add the Custom Policy

Create the folder **checkov/checkov/terraform/checks/resource/linode** and add **authorized_keys.py** with:

```python
from checkov.common.models.enums import CheckCategories, CheckResult
from checkov.terraform.checks.resource.base_resource_value_check import BaseResourceCheck

class authorized_keys(BaseResourceCheck):
    def __init__(self):
        name = "Ensure SSH key set in authorized_keys"
        id = "CKV_LIN_2"
        supported_resources = ['linode_instance']
        categories = [CheckCategories.GENERAL_SECURITY]
        super().__init__(name=name, id=id, categories=categories, supported_resources=supported_resources)

    def scan_resource_conf(self, conf):
        if 'authorized_keys' in conf:
            if conf['authorized_keys']:
                return CheckResult.PASSED
        return CheckResult.FAILED


check = authorized_keys() 
```

And also add **checkov/terraform/checks/resource/linode/__init__.py** with:

```python
from os.path import dirname, basename, isfile, join
import glob
modules = glob.glob(join(dirname(__file__), "*.py"))
__all__ = [ basename(f)[:-3] for f in modules if isfile(f) and not f.endswith('__init__.py')]
```

### Include the Custom Policy

In **checkov/terraform/checks/resource/__init__.py**, update include Linode resources with the entry "from checkov.terraform.checks.resource.linode import * ".

This will ensure that this and any future Linode resource test are included in Checkov runs:

```python
from checkov.terraform.checks.resource.gcp import *
from checkov.terraform.checks.resource.azure import *
from checkov.terraform.checks.resource.github import *
from checkov.terraform.checks.resource.linode import * 
```

## Add new Provider checks

This Provider check verifies that the user hasn't added their Linode token secret to their file. Adding that to a Public repository, well that would be bad, very bad.

### Adding a test

Create the folder **tests/terraform/checks/provider/linode/** and **test_credentials.py**

```python
import unittest

from checkov.terraform.checks.provider.linode.credentials import check
from checkov.common.models.enums import CheckResult


class TestCredentials(unittest.TestCase):

    def test_success(self):
        provider_conf = {}

        scan_result = check.scan_provider_conf(conf=provider_conf)
        self.assertEqual(CheckResult.PASSED, scan_result)

    def test_failure(self):
        provider_conf = {'token' :['AKIAIOSFODNN7EXAMPLE']}
        scan_result = check.scan_provider_conf(conf=provider_conf)
        self.assertEqual(CheckResult.FAILED, scan_result)

if __name__ == '__main__':
    unittest.main()
```

Then add the placeholder **tests/terraform/checks/provider/linode/__init__.py**

```python

```

### Add the Provider check

Create a directory **checkov/terraform/checks/provider/linode** and add **credentials.py**

```python
import re
from checkov.common.models.enums import CheckResult, CheckCategories
from checkov.terraform.checks.provider.base_check import BaseProviderCheck
from checkov.common.models.consts import linode_token_pattern


class LinodeCredentials(BaseProviderCheck):

    def __init__(self):
        name = "Ensure no hard coded Linode tokens exist in provider"
        id = "CKV_LIN_1"
        supported_provider = ['linode']
        categories = [CheckCategories.SECRETS]
        super().__init__(name=name, id=id, categories=categories, supported_provider=supported_provider)

    def scan_provider_conf(self, conf):
        if self.secret_found(conf, "token", linode_token_pattern):
            return CheckResult.FAILED
        return CheckResult.PASSED

    @staticmethod
    def secret_found(conf, field, pattern):
        if field in conf.keys():
            value = conf[field][0]
            if re.match(pattern, value) is not None:
                return True
        return False


check = LinodeCredentials()
```

And also **checkov/terraform/checks/provider/linode/__init__.py**

Update the security constants **checkov/common/models/consts.py** with the new pattern.

```python
SUPPORTED_FILE_EXTENSIONS = [".tf", ".yml", ".yaml", ".json", ".template"]
ANY_VALUE = "CKV_ANY"
DOCKER_IMAGE_REGEX = r'(?:[^\s\/]+/)?([^\s:]+):?([^\s]*)'
access_key_pattern = "(?<![A-Z0-9])[A-Z0-9]{20}(?![A-Z0-9])" # nosec
secret_key_pattern = "(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])" # nosec
linode_token_pattern ="(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{64}(?![A-Za-z0-9/+=])" # nosec

```

```python
from os.path import dirname, basename, isfile, join
import glob

modules = glob.glob(join(dirname(__file__), "*.py"))
__all__ = [basename(f)[:-3] for f in modules if isfile(f) and not f.endswith('__init__.py')]
```

### Include the Provider checks

Update **checkov/terraform/checks/provider/__init__.py** with "from checkov.terraform.checks.provider.linode import *" making it:

```python
from checkov.terraform.checks.provider.aws import *
from checkov.terraform.checks.provider.linode import *
```

So there you have it, 2 new checks, one for the provider, one for your resource and a newly supported Terraform Provider.