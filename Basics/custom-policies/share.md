---
title: "Share"
slug: "share"
hidden: false
createdAt: "2021-03-11T14:30:02.666Z"
updatedAt: "2021-03-22T15:56:55.782Z"
---
# Sharing Policies

[Custom Policies](doc:custom-policies) can be reused across multiple projects. 

You can download a git repository containing custom checks: 
[block:code]
{
  "codes": [
    {
      "code": "checkov --external-checks-git  https://github.com/bridgecrewio/checkov.git",
      "language": "python"
    }
  ]
}
[/block]
#Sub-directories

If you want to download only a specific subdirectory from a Github repository, you can specify a subdirectory after a double-slash` //`. Checkov will first download the URL specified before the double-slash (as if you didn’t specify a double-slash), but will then copy the path after the double slash into a temporal directory.
[block:code]
{
  "codes": [
    {
      "code": "checkov --external-checks-git  https://github.com/bridgecrewio/checkov.git//tests/terraform/checks/resource/registry/example_external_dir/extra_checks",
      "language": "text",
      "name": " "
    }
  ]
}
[/block]
For example, if you’re downloading this GitHub repository, but you only want to download the “extra_checks” directory, you can do the following:

`https://github.com/bridgecrewio/checkov.git//extra_checks`