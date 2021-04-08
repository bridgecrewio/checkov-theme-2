---
title: "Kubernetes"
slug: "kubernetes"
hidden: false
createdAt: "2021-03-11T14:31:16.558Z"
updatedAt: "2021-03-11T21:35:25.423Z"
---
# Integrate Checkov with Kubernetes 

## Background
Checkov is built to scan static code and is typically used at build time.  However, resources running in a Kubernetes cluster can be described in the same way as at build time. This allows Checkov to run in a cluster with read-only access and report on the same violations.  

## Execution
To run Checkov in your cluster you must have Kubernetes CLI access to the cluster.  

To execute a job against your cluster, run the following manifest:
[block:code]
{
  "codes": [
    {
      "code": "kubectl apply -f https://raw.githubusercontent.com/bridgecrewio/checkov/master/kubernetes/checkov-job.yaml",
      "language": "python"
    }
  ]
}
[/block]
Review the output of the job.
[block:code]
{
  "codes": [
    {
      "code": "kubectl get jobs -n checkov\nkubectl logs job/checkov -n checkov",
      "language": "python"
    }
  ]
}
[/block]