---
title: "Jenkins"
slug: "jenkins"
hidden: false
layout: default
createdAt: "2021-03-11T14:30:49.827Z"
updatedAt: "2021-03-18T13:21:17.343Z"
---
# Integrate Checkov with Jenkins

## Tutorial

1. Create new Jenkins Pipeline or integrate into an existing one.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/3de7df7-jenkins_new_pipeline.png",
        "jenkins_new_pipeline.png",
        3330,
        2392,
        "#efefef"
      ],
      "border": true
    }
  ]
}
[/block]
2. Add new a stage into the pipeline definition using a `pipeline script`.
[block:code]
{
  "codes": [
    {
      "code": "pipeline {\n    agent {\n        docker {\n            image 'kennethreitz/pipenv:latest'\n            args '-u root --privileged -v /var/run/docker.sock:/var/run/docker.sock'\n            label 'agent'\n        }\n    }\n    stages {\n        stage('test') {\n            steps {\n                checkout([$class: 'GitSCM', branches: [[name: 'master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'github', url: 'git@github.com:bridgecrewio/checkov.git']]])\n                script {\n                    sh \"pipenv install\"\n                    sh \"pipenv run pip install checkov\"\n                    sh \"pipenv run checkov --directory tests/terraform/runner/resources/example -o junitxml > result.xml || true\"\n                    junit \"result.xml\"\n                }\n\n\n            }\n        }\n    }\n    options {\n        preserveStashes()\n        timestamps()\n        ansiColor('xterm')\n    }\n}",
      "language": "python"
    }
  ]
}
[/block]
Modify the `directory` parameter to enable Checkov on the project terraform directory:
[block:code]
{
  "codes": [
    {
      "code": "sh \"pipenv run checkov --directory $TERRAFORM_MAIN_DIRECTORY_HERE -o junitxml > result.xml || true\"",
      "language": "python"
    }
  ]
}
[/block]
#Example
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/33cd0ae-jenkins_pipeline_definition.png",
        "jenkins_pipeline_definition.png",
        3330,
        3620,
        "#f3f3f3"
      ],
      "border": true
    }
  ]
}
[/block]
3. Run `Build Now`.
View build dashboard.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/4479b04-jenkins_all_jobs.png",
        "jenkins_all_jobs.png",
        3330,
        2934,
        "#f4f3f1"
      ],
      "border": true
    }
  ]
}
[/block]
#Jenkins Job Status
##View Job Status
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/d0067e7-jenkins_failed_job.png",
        "jenkins_failed_job.png",
        3330,
        1656,
        "#e9ebec"
      ],
      "border": true
    }
  ]
}
[/block]
##Review Test Result
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/800209d-jenkins_test_results.png",
        "jenkins_test_results.png",
        3790,
        2114,
        "#e8e9ec"
      ],
      "border": true
    }
  ]
}
[/block]