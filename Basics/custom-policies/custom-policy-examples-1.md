---
title: "Examples - YAML-Based Custom Policies"
slug: "custom-policy-examples-1"
hidden: false
createdAt: "2021-03-15T14:12:40.390Z"
updatedAt: "2021-03-21T13:30:40.623Z"
---
#Basic Query - One Attribute Block
[block:code]
{
  "codes": [
    {
      "code": "---\nmetadata:\n name: \"Check that all resources are tagged with the key - env\"\n id: \"CKV2_AWS_1\"\n category: \"GENERAL_SECURITY\"\ndefinition:\n       cond_type: \"attribute\"\n       resource_types: \"all\"\n       attribute: \"tags.env\"\n       operator: \"exists\"",
      "language": "yaml",
      "name": "Basic Policy Definition"
    }
  ]
}
[/block]
#OR at Top Level - Two Attribute Blocks
[block:code]
{
  "codes": [
    {
      "code": "---\nmetadata:\n name: \"Org's compute instances should not be t3.micro or t3.nano\"\n id: \"CKV2_AWS_1\"\n category: \"NETWORKING\"\ndefinition:\n or:\n - cond_type: \"attribute\"\n   resource_types:\n    - \"aws_instance\"\n   attribute: \"instance_type\"\n   operator: \"not_equals\"\n   value: \"t3.micro\"\n - cond_type: \"attribute\"\n   resource_types:\n   - \"aws_instance\"\n   attribute: \"instance_type\"\n   operator: \"not_equals\"\n   value: \"t3.nano\"",
      "language": "yaml",
      "name": "Two Definition Blocks with OR"
    }
  ]
}
[/block]
#OR Logic - Attribute Block

[block:code]
{
  "codes": [
    {
      "code": "---\nmetadata:\n name: \"Check that all encrypted RDS clusters are tagged with encrypted: true\"\n id: \"CKV2_AWS_1\"\n category: \"SECRETS\"\ndefinition:\n and:\n     - cond_type: \"attribute\"\n       resource_types:\n       - \"aws_rds_cluster\"\n       attribute: \"tags.encrypted\"\n       operator: \"equals\"\n       value: \"true\"\n     - or:\n         - cond_type: \"attribute\"\n           resource_types:\n           - \"aws_rds_cluster\"\n           attribute: \"kms_key_id\"\n           operator: \"exists\"\n         - cond_type: \"attribute\"\n           resource_types:\n           - \"aws_rds_cluster\"\n           attribute: \"storage_encrypted\"\n           operator: \"equals\"\n           value: \"true\"",
      "language": "yaml",
      "name": "Or Logic - Attribute Block"
    }
  ]
}
[/block]
#OR -  Multiple Attribute Blocks
[block:code]
{
  "codes": [
    {
      "code": "---\nmetadata:\n name: \"Ensure all AWS databases have Backup Policy\"\n id: \"CKV2_AWS_1\"\n category: \"BACKUP_AND_RECOVERY\"\ndefinition:\n or:\n   - cond_type: \"attribute\"\n     resource_types:\n     - \"aws_rds_cluster\"\n     - \"aws_db_instance\"\n     attribute: \"backup_retention_period\"\n     operator: \"not_exists\"\n   - cond_type: \"attribute\"\n     resource_types:\n     - \"aws_rds_cluster\"\n     - \"aws_db_instance\"\n     attribute: \"backup_retention_period\"\n     operator: \"not_equals\"\n     value: \"0\"\n   - cond_type: \"attribute\"\n     resource_types:\n     - \"aws_redshift_cluster\"\n     attribute: \"automated_snapshot_retention_period\"\n     operator: \"not_equals\"\n     value: \"0\"\n   - cond_type: \"attribute\"\n     resource_types:\n     - \"aws_dynamodb_table\"\n     attribute: \"point_in_time_recovery\"\n     operator: \"not_equals\"\n     value: \"false\"\n   - cond_type: \"attribute\"\n     resource_types:\n     - \"aws_dynamodb_table\"\n     attribute: \"point_in_time_recovery\"\n     operator: \"exists\"",
      "language": "yaml",
      "name": "Or -  Multiple Attribute Blocks"
    }
  ]
}
[/block]
#Simple Connection State Block and Filter and Attribute Blocks
[block:code]
{
  "codes": [
    {
      "code": "---\nmetadata:\n name: \"Ensure all EC2s are connected only to encrypted EBS volumes\"\n id: \"CKV2_AWS_1\"\n category: \"ENCRYPTION\"\ndefinition:\n    and:\n        - cond_type: \"attribute\"\n          resource_types:\n          - \"aws_ebs_volume\"\n          attribute: \"encrypted\"\n          operator: \"equals\"\n          value: \"true\"\n        - cond_type: \"connection\"\n          resource_types:\n          - \"aws_volume_attachment\"\n          connected_resource_types:\n          - \"aws_ebs_volume\"\n          operator: \"exists\"\n        - cond_type: \"filter\"\n          attribute: \"resource_type\"\n          value:\n           - \"aws_ebs_volume\"\n          operator: \"within\"",
      "language": "yaml",
      "name": "Simple Connection State Block + Filter + Attribute Blocks"
    }
  ]
}
[/block]
#Complex Definition - Connection State Block and Filter and Attribute Blocks - Example 1
[block:code]
{
  "codes": [
    {
      "code": "---\nmetadata:\n  name: \"Ensure all ALBs are connected only to HTTPS listeners\"\n  id: \"CKV2_AWS_1\"\n  category: \"NETWORKING\"\ndefinition:\n  and:\n  - cond_type: \"filter\"\n    value:\n    - \"aws_lb\"\n    attribute: \"resource_type\"\n    operator: \"within\"\n  - cond_type: \"attribute\"\n    resource_types:\n    - \"aws_lb\"    \n    attribute: \"load_balancer_type\"\n    operator: \"equals\"\n    value: \"application\"\n  - or:\n    - cond_type: \"connection\"\n      resource_types:\n      - \"aws_lb\"\n      connected_resource_types:\n      - \"aws_lb_listener\"\n      operator: \"not_exists\"\n    - and:\n      - cond_type: \"connection\"\n        resource_types:\n        - \"aws_lb\"\n        connected_resource_types:\n        - \"aws_lb_listener\"\n        operator: \"exists\"\n      - cond_type: \"attribute\"\n        resource_types:\n        - \"aws_lb_listener\"\n        attribute: \"certificate_arn\"\n        operator: \"exists\"\n      - cond_type: \"attribute\"\n        resource_types:\n        - \"aws_lb_listener\"\n        attribute: \"ssl_policy\"\n        operator: \"exists\"\n      - cond_type: \"attribute\"\n        resource_types:\n        - \"aws_lb_listener\"\n        attribute: \"protocol\"\n        operator: \"equals\"\n        value: \"HTTPS\"\n      - or:\n        - cond_type: \"attribute\"\n          resource_types:\n          - \"aws_lb_listener\"\n          attribute: \"default_action.redirect.protocol\"\n          operator: \"equals\"\n          value: \"HTTPS\"\n        - cond_type: \"attribute\"\n          resource_types:\n          - \"aws_lb_listener\"\n          attribute: \"default_action.redirect.protocol\"\n          operator: \"not_exists\"\n      - or:\n        - cond_type: \"connection\"\n          resource_types:\n          - \"aws_lb_listener_rule\"\n          connected_resource_types:\n          - \"aws_lb_listener\"\n          operator: \"not_exists\"\n        - and:\n          - cond_type: \"connection\"\n            resource_types:\n            - \"aws_lb_listener_rule\"\n            connected_resource_types:\n            - \"aws_lb_listener\"\n            operator: \"exists\"\n          - or:\n            - cond_type: \"attribute\"\n              resource_types:\n              - \"aws_lb_listener_rule\"\n              attribute: \"default_action.redirect.protocol\"\n              operator: \"equals\"\n              value: \"HTTPS\"\n            - cond_type: \"attribute\"\n              resource_types:\n              - \"aws_lb_listener_rule\"\n              attribute: \"default_action.redirect.protocol\"\n              operator: \"not_exists\"",
      "language": "yaml",
      "name": "Complex Definition - Connection State Block + Filter + Attribute Blocks - Example 1"
    }
  ]
}
[/block]
#Complex Definition - Connection State Block and Filter and Attribute Blocks - Example 2
[block:code]
{
  "codes": [
    {
      "code": "---\nmetadata:\n  name: \"Ensure resources allows encrypted ingress communication (SSH)\"\n  id: \"CKV2_AWS_1\"\n  category: \"NETWORKING\"\ndefinition:\n  and:\n  - cond_type: \"filter\"\n    attribute: \"resource_type\"\n    value:\n    - \"aws_instance\"\n    - \"aws_elb\"\n    - \"aws_lb\"\n    - \"aws_db_instance\"\n    - \"aws_elasticache_cluster\"\n    - \"aws_emr_cluster\"\n    - \"aws_redshift_cluster\"\n    - \"aws_elasticsearch_domain\"\n    - \"aws_rds_cluster\"\n    - \"aws_efs_mount_target\"\n    - \"aws_efs_file_system\"\n    - \"aws_ecs_service\"\n    operator: \"within\"\n  - cond_type: \"connection\"\n    resource_types:\n    - \"aws_instance\"\n    - \"aws_elb\"\n    - \"aws_lb\"\n    - \"aws_db_instance\"\n    - \"aws_elasticache_cluster\"\n    - \"aws_emr_cluster\"\n    - \"aws_redshift_cluster\"\n    - \"aws_elasticsearch_domain\"\n    - \"aws_rds_cluster\"\n    - \"aws_efs_mount_target\"\n    - \"aws_efs_file_system\"\n    - \"aws_ecs_service\"\n    connected_resource_types:\n    - \"aws_security_group\"\n    - \"aws_default_security_group\"\n    operator: \"exists\"\n  - or:\n    - cond_type: \"attribute\"\n      resource_types:\n      - \"aws_security_group\"\n      - \"aws_default_security_group\"\n      attribute: \"ingress.from_port\"\n      operator: \"equals\"\n      value: \"22\"\n    - cond_type: \"attribute\"\n      resource_types:\n      - \"aws_security_group\"\n      - \"aws_default_security_group\"\n      value: \"22\"\n      operator: \"equals\"\n      attribute: \"ingress.to_port\"\n  - or:\n    - cond_type: \"connection\"\n      resource_types:\n      - \"aws_security_group_rule\"\n      connected_resource_types:\n      - \"aws_security_group\"\n      - \"aws_default_security_group\"\n      operator: \"not_exists\"\n    - and:\n      - cond_type: \"connection\"\n        resource_types:\n        - \"aws_security_group_rule\"\n        connected_resource_types:\n        - \"aws_security_group\"\n        - \"aws_default_security_group\"\n        operator: \"exists\"\n      - cond_type: \"attribute\"\n        resource_types:\n        - \"aws_security_group_rule\"\n        attribute: \"type\"\n        operator: \"equals\"\n        value: \"ingress\"\n      - or:\n        - cond_type: \"attribute\"\n          resource_types:\n          - \"aws_security_group_rule\"\n          attribute: \"to_port\"\n          operator: \"equals\"\n          value: \"22\"\n        - cond_type: \"attribute\"\n          resource_types:\n          - \"aws_security_group_rule\"\n          attribute: \"from_port\"\n          operator: \"equals\"\n          value: \"22\"",
      "language": "yaml",
      "name": "Complex Definition - Connection State Block + Filter + Attribute Blocks - Example 2"
    }
  ]
}
[/block]