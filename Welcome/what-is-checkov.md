---
title: What is Checkov?
hidden: false
createdAt: "2021-03-11T13:32:51.381Z"
updatedAt: "2021-03-22T16:32:19.539Z"
layout: default
nav_order: 1
---

# What is Checkov?

## Overview

Checkov is a static code analysis tool for scanning IaC files for misconfigurations that could lead to security problems. Checkov includes more than 750 predefined Policies to check for common misconfiguration issues and also supports creation and contribution of of Custom Policies. 

## IaC Types

Checkov scans these IaC file types:
  * Terraform (for AWS, GCP and Azure)
  * CloudFormation
  * ARM
  * Kubernetes
  * Docker

## Custom Policies

Custom policies can be created to (1)  check cloud resources based on configuration attributes (in Python or YAML and (2) check resource composite or connection-states (in YAML). In effect, Checkov creates a cloud resource connection graph for deep misconfiguration analysis; see [Create Custom Policy - - Attribute Check and Composite](doc:create-custom-policy-yaml-attribute-check-and-composite) 

## Compliance with Industry Standards

In addition, Checkov scans check for compliance with common industry standards such as the Center for Internet Security (CIS) and Amazon Web Services (AWS) Foundations Benchmark.