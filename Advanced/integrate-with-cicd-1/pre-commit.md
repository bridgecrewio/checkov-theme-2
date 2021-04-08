---
title: "Pre-Commit"
slug: "pre-commit"
hidden: false
createdAt: "2021-03-22T15:25:02.647Z"
updatedAt: "2021-03-22T15:29:41.023Z"
---
#Setup
To use Checkov with **pre-commit**, add the following to your local repo’s `.pre-commit-config.yaml` file. Make sure to change `rev:` to either a git commit sha or tag of Checkov containing `.pre-commit-hooks.yaml`.
[block:code]
{
  "codes": [
    {
      "code": "- repo: https://github.com/bridgecrewio/checkov.git\n  rev: '' # change to tag or sha\n  hooks:\n    - id: checkov",
      "language": "yaml",
      "name": " "
    }
  ]
}
[/block]
#Adding Custom Parameters
You can use the `args` property to input arguments to Checkov. In the example below, Checkov output will be printed, and then Checkov will proceed to the next pre-commit check *regardless of success/failure *.
[block:code]
{
  "codes": [
    {
      "code": "repos:\n- repo: https://github.com/bridgecrewio/checkov.git\n  rev: '' # change to tag or sha\n  hooks:\n  - id: checkov\n    verbose: true\n    args: [--soft-fail]\n- repo: https://github.com/pre-commit/pre-commit-hooks\n  rev: v3.2.0\n  hooks:\n  - id: trailing-whitespace",
      "language": "yaml",
      "name": " "
    }
  ]
}
[/block]

Similarly, to specify custom policies installed in the `checks` directory of your repository, use the following:
[block:code]
{
  "codes": [
    {
      "code": "repos:\n- repo: https://github.com/bridgecrewio/checkov.git\n  rev: '' # change to tag or sha\n  hooks:\n  - id: checkov\n    args: [--external-checks-dir, 'checks']",
      "language": "yaml",
      "name": " "
    }
  ]
}
[/block]