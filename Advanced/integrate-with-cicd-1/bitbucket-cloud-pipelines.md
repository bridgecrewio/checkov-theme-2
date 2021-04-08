---
title: "Bitbucket Cloud Pipelines"
slug: "bitbucket-cloud-pipelines"
hidden: false
createdAt: "2021-03-11T14:30:56.316Z"
updatedAt: "2021-03-18T13:22:25.715Z"
---
# Integrate Checkov with Bitbucket Cloud Pipelines
You can integrate checkov into your Bitbucket Cloud pipelines. This provides a simple, automatic way of applying policies to your Terraform code both during merge request review and as part of your build process.

## Basic Setup
Add a new step in the `bitbucket-pipelines.yml` file in your repository as part of whichever pipelines are appropriate for you.

Consider this basic example:
[block:code]
{
  "codes": [
    {
      "code": "checkov: &checkov\n  step:\n    name: Checkov\n    image:\n      name: bridgecrew/checkov:latest\n      entrypoint:\n        - '/usr/bin/env'\n        - 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'\n    script:\n      - checkov -d .\n\npipelines:\n  default:\n    - <<: *checkov",
      "language": "yaml",
      "name": " "
    }
  ]
}
[/block]
#Bitbucket Cloud Pipeline - Results
When your pipeline executes, it will run this job. If checkov finds any issues, it will fail the build.

## Pipeline Failure
For example, I have an S3 bucket that does not have versioning enabled. Checkov detects this and fails the job and pipeline.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/20fb126-bitbucket_failed_pipeline.png",
        "bitbucket_failed_pipeline.png",
        1199,
        1108,
        "#777a85"
      ]
    }
  ]
}
[/block]
This will comment on an associated merge request or fail the build depending on the context.

## Pipeline Success
Once I have corrected the configuration, checkov verifies that all is well.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/fd40eae-bitbucket_results.png",
        "bitbucket_results.png",
        1199,
        1108,
        "#747a86"
      ]
    }
  ]
}
[/block]
#Further Reading
See the [Bitbucket pipelines documentation](https://confluence.atlassian.com/bitbucket/build-test-and-deploy-with-pipelines-792496469.html) for additional information.