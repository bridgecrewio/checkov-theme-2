---
title: "Github Actions"
slug: "github-actions"
hidden: false
createdAt: "2021-03-11T14:31:03.660Z"
updatedAt: "2021-03-18T13:24:17.461Z"
---
#Integrate Checkov with Github Actions

You can integrate Checkov into Github Actions. This provides a simple, automatic way of applying policies to your Terraform code both during merge request review and as part of any build process.

#Use a Checkov Action from the Marketplace
See [here](https://github.com/bridgecrewio/checkov-action).

## Create Your Own Action: Basic Set-up
Add a new step in `workflow.yml`.
[block:code]
{
  "codes": [
    {
      "code": "├───.github\n│   └───workflows",
      "language": "text"
    }
  ]
}
[/block]
Example
[block:code]
{
  "codes": [
    {
      "code": "---\nname: Checkov\non:\n  push:\n    branches:\n      - master\njobs:\n  build:\n\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - name: Set up Python 3.8\n        uses: actions/setup-python@v1\n        with:\n          python-version: 3.8\n      - name: Test with Checkov\n        id: checkov\n        uses: bridgecrewio/checkov-action@master\n        with:\n          directory: example/examplea\n          framework: terraform ",
      "language": "yaml"
    }
  ]
}
[/block]
## Example Results
Any time after you push your code to Github, it will run this job. If Checkov finds any issues, it will fail the build.

#View Github Actions Results
## Action Failure
In the original examples code, the file **aws_efs_file_system.sharedstore.tf** is not set to be encrypted. 
[block:code]
{
  "codes": [
    {
      "code": "resource \"aws_efs_file_system\" \"sharedstore\" {\n  creation_token = var.efs[\"creation_token\"]\n\n  lifecycle_policy {\n    transition_to_ia = var.efs[\"transition_to_ia\"]\n  }\n\n  kms_key_id                      = var.efs[\"kms_key_id\"]\n  encrypted                       = false\n  performance_mode                = var.efs[\"performance_mode\"]\n  provisioned_throughput_in_mibps = var.efs[\"provisioned_throughput_in_mibps\"]\n  throughput_mode                 = var.efs[\"throughput_mode\"]\n}\n",
      "language": "python"
    }
  ]
}
[/block]
This will fail a Checkov test:
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/9d0ef08-actions_failure.png",
        "actions_failure.png",
        2660,
        2050,
        "#898d90"
      ],
      "border": true
    }
  ]
}
[/block]
## Pipeline Success
The previous error can be fixed by setting the value of encryption to **true**.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/7f0e961-actions_success.png",
        "actions_success.png",
        2565,
        2061,
        "#82868a"
      ],
      "border": true
    }
  ]
}
[/block]
#Further Reading
For more details on using Python in Github Actions <https://help.github.com/en/actions/language-and-framework-guides/using-python-with-github-actions>.

The test code sample: <https://github.com/JamesWoolfenden/terraform-aws-appsync/blob/master/.github/workflows/master.yml>