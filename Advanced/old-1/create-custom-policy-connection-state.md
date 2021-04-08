---
title: "Create Custom Policy - YAML - Attribute Check and Composite_OLD"
slug: "create-custom-policy-connection-state"
hidden: true
createdAt: "2021-03-11T14:29:04.059Z"
updatedAt: "2021-03-17T11:14:26.389Z"
---
#Overview

**NOTE - NEED TO REPLACE ALL EXAMPLE REFERENCES!!!**


#Metadata

Base examples on this:
OR at Top Level - Two Attribute Blocks
https://docs.bridgecrew.io/v3/docs/custom-policy-examples-1#or-at-top-level---two-attribute-blocks


# Policy Definition Component - Specification
## Overview
Image below no good
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/9f8d02c-highlight_on_definition.jpg",
        "highlight on definition.jpg",
        936,
        388,
        "#f6f7f2"
      ]
    }
  ]
}
[/block]
A Policy Definition consists of:
  * **Defintion Block(s)**- either *Attribute Block(s*) or *Connection State Block(s)* or both
  * **Logical Operator(s)** (optional)
  * **Filter **(optional)

##Types of Definition Block
  * **Attribute **- The policy describes resources with a certain configuration as defined by a configuration **attribute **and its value (per Terraform), or by the presence/absence of an attribute.
  * **Connection State** - The policy describes resources in a particular **Connection State**, in other words, connected, or not connected to another type of resource (for example, a security group).
[block:callout]
{
  "type": "success",
  "title": "Using AND/OR Logic",
  "body": "A policy definition may include multiple blocks (**Attribute**, **Connection State** or both), associated by **AND/OR** logic."
}
[/block]
##Attribute Block
### Overview
An **Attribute Block** in a policy's definition, indicates that a resource will be non-compliant if a certain configuration attribute does not have a specified value, or if it exists/doesn't exist.

[block:callout]
{
  "type": "info",
  "title": "Note",
  "body": "Bridgecrew's Custom Policies in code utilize the Terraform attribute library and syntax.\nThese policies are checked during scans of both buildtime and runtime resources and for all supported cloud providers."
}
[/block]

###Attribute - Example 

The Attribute Block in the Definition in the example below, is used to ensure that a proper backup policy is configured for Redshift clusters.

[block:code]
{
  "codes": [
    {
      "code": "definition:\n     cond_type: \"attribute\"\n     resource_types:\n     - \"aws_redshift_cluster\"\n     attribute: \"automated_snapshot_retention_period\"\n     operator: \"not_equals\"\n     value: \"0\"",
      "language": "yaml",
      "name": "Example - Attribute"
    }
  ]
}
[/block]

###Attribute Condition: Operators
[block:parameters]
{
  "data": {
    "h-0": "Operator",
    "h-1": "Value in YAML",
    "0-0": "Equals",
    "1-0": "Not Equals",
    "2-0": "Exists",
    "3-0": "Not Exists",
    "4-0": "Contains",
    "5-0": "Not Contains",
    "0-1": "`equals`",
    "1-1": "`not_equals`",
    "2-1": "`exists`",
    "3-1": "`not_exists`",
    "4-1": "`contains`",
    "5-1": "`not_contains`"
  },
  "cols": 2,
  "rows": 6
}
[/block]

###Attribute Condition: Keys and Values
[block:parameters]
{
  "data": {
    "h-0": "Key",
    "h-1": "Type",
    "h-2": "Value(s)",
    "0-0": "cond_type",
    "1-0": "resource_type",
    "2-0": "attribute",
    "3-0": "operator",
    "4-0": "value (not relevant for operator: `exists`/`not_exists`)",
    "1-1": "collection of strings",
    "0-1": "string",
    "2-1": "string",
    "3-1": "string",
    "4-1": "string",
    "0-2": "Must be:\n`attribute`",
    "1-2": "Use either:\n1. `all`\n2. resource types from list",
    "2-2": "*Attribute of defined resource types*\nFor example, `automated_snapshot_retention_period`",
    "3-2": "`equals`\n`not_equals`\n`exists`\n`not exists` \n`contains`\n`not_contains`",
    "4-2": "*User input* "
  },
  "cols": 3,
  "rows": 5
}
[/block]

[block:callout]
{
  "type": "success",
  "title": "See Examples of Multiple Attribute Blocks using AND/OR Logic",
  "body": "For examples of Policy Definitions with multiple Attribute Blocks using AND/OR logic, see:\n\n[**Two Attribute Blocks with OR at Top Level**](doc:examples-yaml-based-custom-policies#section-or-at-top-level-two-attribute-blocks)\n\n [**Attribute Block with OR Logic**](doc:examples-yaml-based-custom-policies#section-or-logic-attribute-block)\n\n[**Multiple Attribute Blocks with OR Relationship**](doc:examples-yaml-based-custom-policies#section-or-multiple-attribute-blocks)"
}
[/block]

##Connection State Block
###Overview
A Connection State Block indicates a type of resource that has/doesn't have a connection to another type of resource.
In the example presented in the table below, in order to be compliant `aws_lb` and `aws_elb` must have connections to either `aws_security_group` or `aws_default_security_group`.
[block:parameters]
{
  "data": {
    "h-0": "Group A",
    "h-1": "Group B",
    "0-0": "`aws_lb`\n`aws_elb`",
    "0-1": "`aws_security_group`\n`aws_default_security_group`"
  },
  "cols": 2,
  "rows": 1
}
[/block]
### Connection State - Example
The Connection State Block below indicates that to be compliant with the policy, resources of type `aws_lb` or of type `aws_elb` must be connected to either a resource of type `aws_security_group` or a resource of type `aws_default_security_group`.
[block:code]
{
  "codes": [
    {
      "code": "definition:\n       cond_type: \"connection\"\n       resource_types:\n           - \"aws_elb\"\n       connected_resource_types:\n         - \"aws_security_group\"\n         - \"aws_default_security_group\"\n       operator: \"exists\"\n\n",
      "language": "yaml",
      "name": "Connection State - Example"
    }
  ]
}
[/block]
###Connection State: Operators
[block:parameters]
{
  "data": {
    "h-0": "Operator",
    "h-1": "Value",
    "0-0": "Exists",
    "1-0": "Not Exists",
    "0-1": "`exists`",
    "1-1": "`not_exists`"
  },
  "cols": 2,
  "rows": 2
}
[/block]
###Connection State: Keys and Values
[block:parameters]
{
  "data": {
    "h-0": "Key",
    "h-1": "Type",
    "h-2": "Values",
    "0-0": "cond_type",
    "0-2": "Must be:\n`connection`",
    "0-1": "String",
    "1-0": "resource_types",
    "1-1": "",
    "1-2": "Use either:\n1. `all`\n2. <included resource type from list>",
    "2-0": "connected_resource_types",
    "2-1": "Collection of strings",
    "3-0": "operator",
    "3-1": "String",
    "3-2": "`exists`/`not exists`",
    "2-2": "Use either:\n1. `all` \n2. <included resource type from list>"
  },
  "cols": 3,
  "rows": 4
}
[/block]
## Filters
###Overview
Filters can be used to limit the types of resources relevant to a condition. Filters are most commonly used for Connection Blocks. (For Attribute Blocks you can easily limit the resource type with the resource_type parameter.)
For example, you may want to enforce a policy only for specific resource type(s) from specific groups defined in the conditions. Filters are available only for AND logic, at the top level.

###Filter - Example
The Custom Policy in this example ensures that all ELBs are attached to security groups as shown in the table below.
In line with best practices, connections of this nature should be defined using **security_groups **key.
[block:parameters]
{
  "data": {
    "h-0": "Group A",
    "h-1": "Group B",
    "0-0": "`aws_elb`",
    "0-1": "`aws_security_group`\n`aws_default_security_group`"
  },
  "cols": 2,
  "rows": 1
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "defintion:\n and:\n      - cond_type: \"filter\"\n        resource_types:\n           - \"aws_elb\"\n        attribute: “resource_type”\n        operator: \"within”\n      - cond_type: \"connection\"\n        resource_types:\n           - \"aws_elb\"\n        connected_resource_types:\n         - \"aws_security_group\"\n         - \"aws_default_security_group\"\n        operator: \"exists\"",
      "language": "yaml",
      "name": "Filter - Example"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "Note",
  "body": "Note: \nThe condition above uses AND logic. See [additional examples ](doc:examples-yaml-based-custom-policies) of complex logic in policy definitions."
}
[/block]

[block:callout]
{
  "type": "success",
  "title": "See Examples of Complex Definitions with Connection State Blocks and Filters",
  "body": "[**Simple Connection State Block and Filter and Attribute Blocks**](doc:examples-yaml-based-custom-policies#section-simple-connection-state-block-and-filter-and-attribute-blocks)\n\n[**Complex Definition - Connection State Block + Filter + Attribute Blocks - Example 1**](doc:examples-yaml-based-custom-policies#section-complex-definition-connection-state-block-and-filter-and-attribute-blocks-example-1)\n\n[**Complex Definition - Connection State Block + Filter + Attribute Blocks - Example 2**](doc:examples-yaml-based-custom-policies#section-complex-definition-connection-state-block-and-filter-and-attribute-blocks-example-2)"
}
[/block]

##Using AND/OR Logic

Bridgecrew Cloud allows combination of definition blocks using AND/OR operators.
[block:callout]
{
  "type": "info",
  "body": "1. The top-level logical operator is the first key below \"definition\" (and not an item in a collection). It defines the relationship of all of the definition blocks in the specific YAML policy definition.\n2. Filter blocks apply (only) to the top-level and constitute an AND condition. For example, if you'd like to indicate a requirement for a Connection State between types of resources, but only within a certain subset of all of those resources.\n3. Every other logical operator applies within a collection. For example, you can use AND/OR logic in a collection of key-value pairs.",
  "title": "Notes"
}
[/block]
###Example
The logic in the policy definition shown below is
`AND[block 1,block 2,OR[block 3,block 4]]`.
[block:code]
{
  "codes": [
    {
      "code": "#....\ndefintion:\n           and:\n               - #filter block 1\n               - #block 2\n               - or:\n                   - #block 3\n                   - #block 4",
      "language": "yaml",
      "name": "Example - And/Or Logic in policy definition"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "success",
  "title": "See All Examples",
  "body": "[See all examples of Custom Policies in code](doc:examples-yaml-based-custom-policies)"
}
[/block]