---
title: "Installing Checkov"
slug: "installing-checkov"
hidden: false
createdAt: "2021-03-11T14:27:22.905Z"
updatedAt: "2021-03-18T15:00:48.508Z"
---
Installing Checkov is quick and straightforward - install, configure input & scan.

# Install From PyPI Using Pip
[block:code]
{
  "codes": [
    {
      "code": "pip install checkov",
      "language": "shell",
      "name": "Install from PyPI Using Pip"
    }
  ]
}
[/block]
#Install on Python
[block:code]
{
  "codes": [
    {
      "code": "pip3 install checkov\n",
      "language": "shell",
      "name": "Install on Python"
    }
  ]
}
[/block]
#Install on Alpine
[block:code]
{
  "codes": [
    {
      "code": "pip3 install --upgrade pip && pip3 install --upgrade setuptools\npip3 install checkov",
      "language": "shell",
      "name": "Install on Alpine"
    }
  ]
}
[/block]
#Install on Ubuntu 18.04 LTS

Ubuntu 18.04 ships with Python 3.6. Before you can install Checkov, you need to install python 3.7 (from the PPA repository):
[block:code]
{
  "codes": [
    {
      "code": "sudo apt update\nsudo apt install software-properties-common\nsudo add-apt-repository ppa:deadsnakes/ppa\nsudo apt install python3.7\nsudo apt install python3-pip\nsudo python3.7 -m pip install -U checkov #to install or upgrade checkov)",
      "language": "shell",
      "name": "Install on Ubuntu 18.04 LTS"
    }
  ]
}
[/block]
or using homebrew (MacOS only)

[block:code]
{
  "codes": [
    {
      "code": "brew install checkov\nor\n\nbrew upgrade checkov",
      "language": "text",
      "name": " "
    }
  ]
}
[/block]
#Upgrade
If you installed Checkov with pip3, use the following command to upgrade:
[block:code]
{
  "codes": [
    {
      "code": "pip3 install -U checkov",
      "language": "shell",
      "name": "Upgrade"
    }
  ]
}
[/block]
#Configure an Input Folder or File
##Configure Folder
[block:code]
{
  "codes": [
    {
      "code": "checkov --directory /user/path/to/iac/code",
      "language": "shell",
      "name": "Configure Input Folder"
    }
  ]
}
[/block]
##Configure a Specific File
[block:code]
{
  "codes": [
    {
      "code": "checkov --file /user/tf/example.tf",
      "language": "shell",
      "name": "Configure Specific File"
    }
  ]
}
[/block]
##Configure Multiple Specific Files
[block:code]
{
  "codes": [
    {
      "code": "checkov -f /user/cloudformation/example1.yml -f /user/cloudformation/example2.yml",
      "language": "shell",
      "name": "Configure Specific Files"
    }
  ]
}
[/block]
##Configure a Terraform Plan Pile in JSON Format
[block:code]
{
  "codes": [
    {
      "code": "terraform init\nterraform plan -out tf.plan\nterraform show -json tf.plan  > tf.json \ncheckov -f tf.json",
      "language": "json",
      "name": "Configure Terraform Plan File in JSON"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "The Terraform show output file `tf.json` will be a single line. For that reason Checkov will report all findings as line number 0.",
  "title": "Note"
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "check: CKV_AWS_21: \"Ensure all data stored in the S3 bucket have versioning enabled\"\n\tFAILED for resource: aws_s3_bucket.customer\n\tFile: /tf/tf.json:0-0\n\tGuide: https://docs.bridgecrew.io/docs/s3_16-enable-versioning",
      "language": "json",
      "name": "Terraform Show Output File Results"
    }
  ]
}
[/block]
If you have installed jq, you can convert a JSON file into multiple lines with the command `terraform show -json tf.plan | jq '.' > tf.json`, making it easier to read the scan result.
[block:code]
{
  "codes": [
    {
      "code": "checkov -f tf.json\nCheck: CKV_AWS_21: \"Ensure all data stored in the S3 bucket have versioning enabled\"\n\tFAILED for resource: aws_s3_bucket.customer\n\tFile: /tf/tf1.json:224-268\n\tGuide: https://docs.bridgecrew.io/docs/s3_16-enable-versioning\n\n\t\t225 |               \"values\": {\n\t\t226 |                 \"acceleration_status\": \"\",\n\t\t227 |                 \"acl\": \"private\",\n\t\t228 |                 \"arn\": \"arn:aws:s3:::mybucket\",",
      "language": "json",
      "name": "Scan Results on Multiple Lines"
    }
  ]
}
[/block]