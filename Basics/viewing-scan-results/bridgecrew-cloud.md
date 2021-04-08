---
title: "old-Bridgecrew Cloud"
slug: "bridgecrew-cloud"
hidden: true
createdAt: "2021-03-16T11:25:53.768Z"
updatedAt: "2021-03-22T15:42:51.214Z"
---
# Integrate Checkov with Bridgecrew Cloud
You can integrate Checkov with Bridgecrew Cloud and view the results of Checkov scans on the Bridgecrew Console.

#Setup
## Get an API Token
To get a Bridgecrew issued API token: 
1. Sign up for [Bridgecrew](https://www.bridgecrew.cloud/). This is free-of-charge.
2. From [Integrations](https://www.bridgecrew.cloud/integrations), select **API Token** and copy the API key.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/1c0e95d-get_api_token.png",
        "get api token.png",
        1436,
        694,
        "#eee9ee"
      ]
    }
  ]
}
[/block]
3. Copy the API key.

#Execution
After acquiring the API key, run Checkov as follows:
- `checkov -d <directory> --bc-api-key <key> --repo-id <repo_id> --branch <branch>`
Or by using the `-f` file flag:
- `checkov -f <file_1> <file_2> ... <file_n> --bc-api-key <key> --repo-id <repo_id> --branch <branch>`

The table below details the arguments used when executing the API key.
[block:parameters]
{
  "data": {
    "0-0": "`<key>`",
    "0-1": "Bridgecrew issued API key",
    "h-0": "Argument",
    "h-1": "Description",
    "1-0": "`<repo_id>`",
    "1-1": "Identifying string of the scanned repository, following the standard Git repository naming scheme: `<owner>/<name>`",
    "2-0": "`<branch>`",
    "2-1": "Branch name to be persisted on platform.\nDefaults to the master branch.\n\n**NOTE:**\nEnsure the scanned directory (supplied in the `-d` flag) is currently checked out from the given branch name."
  },
  "cols": 2,
  "rows": 3
}
[/block]
### Environment Variables
We strongly recommend that Checkov use environment variables that enrich Bridgecrew's context with CI/CD systems data.
[block:parameters]
{
  "data": {
    "h-0": "Environment Variable",
    "h-1": "Description",
    "h-2": "Example",
    "0-0": "BC_FROM_BRANCH",
    "0-1": "Source branch",
    "0-2": "feature/foo",
    "1-0": "BC_TO_BRANCH",
    "1-1": "Target branch",
    "1-2": "main",
    "2-0": "BC_PR_ID",
    "2-1": "Pull request identifier",
    "2-2": "825",
    "3-0": "BC_PR_URL",
    "3-1": "Link to pull request/merge request",
    "3-2": "https://github.com/bridgecrewio/checkov/pull/825",
    "4-0": "BC_COMMIT_HASH",
    "4-1": "Commit identifier",
    "4-2": "5df50ab857e7a255e4e731877748b539915ad489",
    "5-0": "BC_COMMIT_URL",
    "5-1": "Link to commit in CI/VCS system",
    "5-2": "https://github.com/bridgecrewio/checkov/commit/5df50ab857e7a255e4e731877748b539915ad489",
    "6-0": "BC_AUTHOR_NAME",
    "6-1": "User associated with the CI trigger",
    "6-2": "schosterbarak",
    "7-0": "BC_AUTHOR_URL",
    "7-1": "Link to the user profile page",
    "7-2": "https://github.com/schosterbarak",
    "8-0": "BC_RUN_ID",
    "8-1": "CI run identifier",
    "8-2": "525220526",
    "9-0": "BC_RUN_URL",
    "9-1": "Link to the run in the CI system",
    "9-2": "https://github.com/bridgecrewio/checkov/actions/runs/525220526",
    "10-0": "BC_REPOSITORY_URL",
    "10-1": "Link to the github repository",
    "10-2": "https://github.com/bridgecrewio/checkov/",
    "11-0": "BC_SOURCE",
    "11-1": "Name of CI system being integrated",
    "11-2": "githubActions"
  },
  "cols": 3,
  "rows": 12
}
[/block]
# Bridgecrew Cloud View
After successfully terminating, scan results are persisted on [Bridgecrew Cloud](https://www.bridgecrew.cloud), and can be seen in the [Incidents Queue](https://www.bridgecrew.cloud/incidents).
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/214682d-bc-violations.png",
        "bc-violations.png",
        3360,
        1944,
        "#eff0f6"
      ]
    }
  ]
}
[/block]
#Example Usage
The following command scans the repository identified as `foo/bar`, on branch `develop`, using a Bridgecrew API key:
`checkov -d . --bc-api-key 84b8f259-a3dv-5c1e-9422-1bdc9aec0487 --repo-id foo/bar --branch develop`