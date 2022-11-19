# github-actions
[![github-actions-template](https://github.com/amitastreait/github-actions/actions/workflows/main.yml/badge.svg)](https://github.com/amitastreait/github-actions/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/amitastreait/github-actions/branch/main/graph/badge.svg?token=M4740ZWGJH)](https://codecov.io/gh/amitastreait/github-actions)

# How To Setup CI/CD Using GitHub Actions for Salesforce

- Create `.github` folder withing the parent directory of your Git Repo
- Create `workflow` folder withing `.github` folder
- Create `github-actions-demo.yml` file within `workflow` folder and use below sample YML code for the initial setup

![image](https://user-images.githubusercontent.com/14299807/202864209-5b73f7b4-d2ac-4ed8-92fd-e35f41d46db6.png)

```yml
name: GitHub Actions Demo
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v3

      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
      - run: echo "🖥️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 This job's status is ${{ job.status }}."
```

The above pipeline is a simple Github Action pipeline

# Prepare your Salesforce Environment for Github Action CI/CD

### Authentication

> As we will be using the SFDX Commands to deploy the code using Github Action CI/CD tool so we need to authenticate using JWT. Please Follow [Salesforce Document](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_jwt_flow.htm) to generate the Certificate and Create the Connection Application inside Salesforce

- Create a **asset** folder on the parent directory ( same level as .github folder) of your git repo, we will use this in later steps
![image](https://user-images.githubusercontent.com/14299807/202864231-f9cdd583-e0d4-4684-941e-d6d0f8afff51.png)

### Encrypt the `server.key` file using openssl

