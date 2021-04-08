---
title: "Example - Credential Scan"
slug: "example-credential-scan"
hidden: false
createdAt: "2021-03-22T16:01:28.597Z"
updatedAt: "2021-03-22T16:01:28.597Z"
---
#Example - Credential Scan
Checkov can scan for a number of different common credentials, such as AWS access keys, Azure, service credentials, or private keys that are hard coded in a terraform code block.
See list of regular expressions [here](https://github.com/bridgecrewio/checkov/blob/master/checkov/common/util/secrets.py).

Let’s assume we have the following terraform provider block:
[block:code]
{
  "codes": [
    {
      "code": "# Snippet from  main.tf\nprovider \"aws\" {\n  region     = \"us-west-2\"\n  access_key = \"AKIAIOSFODNN7EXAMPLE\"\n  secret_key = \"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\"\n}",
      "language": "yaml",
      "name": " "
    }
  ]
}
[/block]
As stated in Terraform's documentation: “Hard-coding credentials into any Terraform configuration is not recommended, and risks secret leakage should this file ever be committed to a public version control system.”

Run Checkov to detect secrets:
[block:code]
{
  "codes": [
    {
      "code": "checkov -f main.tf",
      "language": "shell",
      "name": " "
    }
  ]
}
[/block]
This is the output of the scan
[block:code]
{
  "codes": [
    {
      "code": "      _               _              \n   ___| |__   ___  ___| | _______   __\n  / __| '_ \\ / _ \\/ __| |/ / _ \\ \\ / /\n | (__| | | |  __/ (__|   < (_) \\ V / \n  \\___|_| |_|\\___|\\___|_|\\_\\___/ \\_/  \n                                      \nversion: 1.0.202 \n\nterraform scan results:\n\nPassed checks: 0, Failed checks: 1, Skipped checks: 0\n\nCheck: CKV_AWS_41: \"Ensure no hard coded AWS access key and secret key exists\"\n\tFAILED for resource: provider.aws\n\tFile: :1-5\n\n\t\t1 | provider \"aws\" {\n\t\t2 |   region     = \"us-west-2\"\n\t\t3 |   access_key = \"AKIAIOSFODNN7EXAMPLE\"\n\t\t4 |   secret_key = \"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\"\n\t\t5 | }",
      "language": "text"
    }
  ]
}
[/block]
Checkov can also detect secrets defined in lambda variables as shown in the example below.
[block:code]
{
  "codes": [
    {
      "code": "resource \"aws_lambda_function\" \"test_lambda\" {\n  filename      = \"resources/lambda_function_payload.zip\"\n  function_name = \"${local.resource_prefix.value}-analysis\"\n  role          = \"${aws_iam_role.iam_for_lambda.arn}\"\n  handler       = \"exports.test\"\n\n  source_code_hash = \"${filebase64sha256(\"resources/lambda_function_payload.zip\")}\"\n\n  runtime = \"nodejs12.x\"\n\n  environment {\n    variables = {\n      access_key = \"AKIAIOSFODNN7EXAMPLE\"\n      secret_key = \"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\"\n    }\n  }\n}",
      "language": "yaml",
      "name": " "
    }
  ]
}
[/block]
or in EC2 user data as shown in the example below:
[block:code]
{
  "codes": [
    {
      "code": "resource \"aws_instance\" \"compute_host\" {\n  # ec2 have plain text secrets in user data\n  ami           = \"ami-04169656fea786776\"\n  instance_type = \"t2.nano\"\n  user_data     = <<EOF\n#! /bin/bash\nsudo apt-get update\nsudo apt-get install -y apache2\nsudo systemctl start apache2\nsudo systemctl enable apache2\nexport AWS_ACCESS_KEY_ID\nexport AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE\nexport AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\nexport AWS_DEFAULT_REGION=us-west-2\necho \"<h1>Deployed via Terraform</h1>\" | sudo tee /var/www/html/index.html\nEOF\n  tags = {\n    Name  = \"${local.resource_prefix.value}-ec2\"\n  }\n}",
      "language": "yaml",
      "name": " "
    }
  ]
}
[/block]