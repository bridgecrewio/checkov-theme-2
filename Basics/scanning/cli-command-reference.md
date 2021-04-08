---
title: "CLI Command Reference"
slug: "cli-command-reference"
hidden: false
createdAt: "2021-03-16T09:53:14.893Z"
updatedAt: "2021-03-18T12:14:46.233Z"
---
[block:parameters]
{
  "data": {
    "h-0": "Parameter",
    "h-1": "Description",
    "h-2": "Reference",
    "15-2": "",
    "0-0": "`-h`, `--help`",
    "0-1": "Show this help message and exit.",
    "1-0": "`-v`, `--version`",
    "1-1": "Version",
    "2-0": "`-d DIRECTORY`, `--directory DIRECTORY`",
    "2-1": "IaC root directory.\nCan not be used together with --file.",
    "3-0": "`-f FILE`, `--file FILE`",
    "3-1": "IaC file.\nCan not be used together with --directory.",
    "4-0": "`--external-checks-dir EXTERNAL_CHECKS_DIR`",
    "4-1": "Directory for custom checks to be loaded. \nCan be repeated.",
    "5-0": "`-l`, `--list`",
    "5-1": "List checks.",
    "6-0": "`-o [{cli,json,junitxml,github_failed_only}]`, `--output [{cli,json,junitxml,github_failed_only}]`",
    "6-1": "Report output format.",
    "7-0": "`--quiet`",
    "7-1": "Display only failed checks in CLI output.",
    "8-0": "`--compact`",
    "8-1": "Do not display code blocks in CLI output.",
    "9-0": "`--framework {cloudformation,terraform,kubernetes,all}`",
    "9-1": "Filter scan to run only on a specific infrastructure code frameworks.\nPossible arguments are:\n* `cloudformation`\n* `terraform`\n* `kubernetes`\n* `all`",
    "10-0": "`-c CHECK`, `--check CHECK`",
    "10-1": "Filter scan to run only on a specific check identifier (allowlist).\nYou can specify multiple checks separated by comma delimiter.",
    "11-0": "`--skip-check SKIP_CHECK`",
    "11-1": "Filter scan to run on all checks except for a specific check identifier (denylist).\nYou can specify multiple checks separated by comma delimiter.",
    "12-0": "`-s`, `--soft-fail`",
    "12-1": "Runs checks but suppresses error code.",
    "13-0": "`--bc-api-key BC_API_KEY`",
    "13-1": "Bridgecrew API key.",
    "14-0": "`--repo-id REPO_ID`",
    "14-1": "The identity string of the repository.\nIt should be in the form:\n`<repo_owner>/<repo_name>`",
    "15-0": "`-b BRANCH`, `--branch BRANCH`",
    "15-1": "The selected branch of the persisted repository. \nOnly has effect when using the `--bc-api-key` flag.",
    "1-2": "",
    "11-2": "[Suppress or Skip](doc:scan-use-cases#section-suppress-or-skip)",
    "12-2": "",
    "13-2": "[View Scan Results](doc:scan-use-cases#section-view-scan-results)",
    "2-2": "[Scan Use Cases](doc:scan-use-cases#section-scan---repo-branch-folder-or-file)",
    "3-2": "[Scan Use Cases](doc:scan-use-cases#section-scan---repo-branch-folder-or-file)",
    "4-2": "[Scan Use Cases](doc:scan-use-cases#section-scan---repo-branch-folder-or-file)",
    "6-2": "[View Scan Results](doc:scan-use-cases#section-view-scan-results)",
    "7-2": "[View Scan Results](doc:scan-use-cases#section-view-scan-results)",
    "9-2": "[Scan Kubernetes Cluster](doc:scan-use-cases#section-scan-kubernetes-cluster)",
    "10-2": "[Scan Use Cases](doc:scan-use-cases#section-other-use-case)",
    "14-2": "[Scan Use Cases](doc:scan-use-cases#section-scan---repo-branch-folder-or-file)"
  },
  "cols": 3,
  "rows": 16
}
[/block]