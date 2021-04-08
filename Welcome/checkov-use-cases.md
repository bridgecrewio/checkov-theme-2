---
title: "Feature Descriptions"
slug: "checkov-use-cases"
hidden: false
createdAt: "2021-03-18T12:03:38.535Z"
updatedAt: "2021-03-22T15:15:02.752Z"
nav_order: 4
layout: default
---
#Overview
With Checkov you can:
  * Run a variety of scan types
  * Enable Checkov to run as part of your CI/CD workflow
  * Create and contribute Custom Checkov Policies
 
#Scan
Checkov scan options are:
  * **Scan** - You can scan a repository, branch, folder or a single file  - see [CLI Command Reference](doc:cli-command-reference).
  * **View Scan Results** - see [Viewing Scan Results](doc:viewing-scan-results) 
  * **Scan for Connection-State (AKA Composite)** -  You can create a Custom Policy to check if a certain type of resource has or does not have a connection to another type of resource; see [Create Custom Policy - YAML - Attribute Check and Composite](doc:create-custom-policy-yaml-attribute-check-and-composite).
  * **Suppress or Skip** - see [Suppress](doc:suppress) 
  * **Scan Kubernetes Cluster** - see [Kubernetes](doc:kubernetes) 
  * **Scan Terraform Plan** - see [Scan Terraform Plan](doc:scan-terraform-plan-1) 
  * **Scan 3rd-Party Terraform Module** see [Scan 3rd Party Terraform Module](doc:scan-3rd-party-terraform-module-1) 

#CI/CD
## Integrate with CI/CD
See:
  * [Integrate with Jenkins](doc:jenkins)
  * [Integrate with Bitbucket Cloud Pipelines](doc:bitbucket-cloud-pipelines) 
  * [Integrate with Github Actions](doc:github-actions) 
  * [Integrate with Gitlab CLI](doc:gitlab-cli) 

## View Checkov CI/CD Results
See:
  * [View Jenkins Job Status](https://docs.bridgecrew.io/v3/docs/jenkins#jenkins-job-status)
  * [View Bitbucket Pipeline Results](https://docs.bridgecrew.io/v3/docs/bitbucket-cloud-pipelines#bitbucket-cloud-pipeline---results)
  * [View Github Action Results](https://docs.bridgecrew.io/v3/docs/github-actions#view-github-actions-results)
  * [View Gitlab CLI Results](https://docs.bridgecrew.io/v3/docs/gitlab-cli#view-gitlab-cli-results)

#Custom Policies
See:
  * [Create Custom Policy - Python - Attribute Check](doc:create-custom-policy-python-attribute-check) 
  * [Create Custom Policy - YAML - Attribute Check and Composite](doc:create-custom-policy-yaml-attribute-check-and-composite) 
  * [Custom Policy Examples](doc:custom-policy-examples-1) 
  * [Create Policies for a New Provider](doc:create-policies-for-a-new-provider) 
  * [Share Custom Policy across Repos](doc:share) 
  * [Contribute New Provider](doc:contribute) 
  * [Contribute New Policy](doc:contribute-new-policy)