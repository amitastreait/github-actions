# CI/CD Pipeline Analysis

[![github-actions-template](https://github.com/amitastreait/github-actions/actions/workflows/main.yml/badge.svg)](https://github.com/amitastreait/github-actions/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/amitastreait/github-actions/branch/main/graph/badge.svg?token=M4740ZWGJH)](https://codecov.io/gh/amitastreait/github-actions)

## SonarCloud Analysis

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=amitastreait_github-actions&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=amitastreait_github-actions)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=amitastreait_github-actions&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=amitastreait_github-actions)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=amitastreait_github-actions&metric=coverage)](https://sonarcloud.io/summary/new_code?id=amitastreait_github-actions)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=amitastreait_github-actions&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=amitastreait_github-actions)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=amitastreait_github-actions&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=amitastreait_github-actions)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=amitastreait_github-actions&metric=bugs)](https://sonarcloud.io/summary/new_code?id=amitastreait_github-actions)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=amitastreait_github-actions&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=amitastreait_github-actions)

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

### Pipeline Explanation
- `name` : The name that will be displayed under the Actions Tab. This could be any meaningful word. Like Prod Pipeline, QA Pipeline, etc
- `run-name`: The title that will be displayed when the GitHub Action will run 
- `on` : These are the events when you wanted to execute your pipeline. For Example, you only wanted to execute pipeline when the pull request is merged then the event will be `pull_request`. To more all about the event [Check Official Document](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)
- `Jobs` : This is the place where we define our all Jobs that will be executed
- `runs-on`: This is the name of the runner where you wanted to run your pipeline. I have used `ubuntu-latest` but you can use from the [Available](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners) runnes in Github Actions
- `steps`: These are the steps that we define witin our Jobs. For Example, installing the SFDX, Authenticating with Salesforce, Running Apex Test, Deployment, & etc

# Prepare your Salesforce Environment for Github Action CI/CD

### Authentication

> As we will be using the SFDX Commands to deploy the code using Github Action CI/CD tool so we need to authenticate using JWT. Please Follow [Salesforce Document](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_jwt_flow.htm) to generate the Certificate and Create the Connection Application inside Salesforce

- Create a **asset** folder on the parent directory ( same level as .github folder) of your git repo, we will use this in later steps
![image](https://user-images.githubusercontent.com/14299807/202864231-f9cdd583-e0d4-4684-941e-d6d0f8afff51.png)

### Encrypt the `server.key` file using openssl

#### Generate the Key & IV
Execute the below command within the folder where your `server.key` file is located to generate the KEY & IV, once genetaed then please take a note and store it in some place from where you can easily get

````cmd
openssl enc -aes-256-cbc -k GITHUBACTIONS -P -md sha1 -nosalt
````

#### Encrypt the server.key file & generate server.key.enc file
Execute the below command within the folder where your `server.key` file is located to generate the encrypted file.
````cmd
openssl enc -nosalt -aes-256-cbc -in server.key -out server.key.enc -base64 -K <KEY> -iv <IV>
````
> Note:  In the above command use your KEY & IV which you have generated in the previous step

## Place server.key.enc file within asset folder of your repo

![image](https://user-images.githubusercontent.com/14299807/202864720-862d1d13-e344-4099-b9f5-77bd0a8ff6aa.png)

## Test #1
Now as we are done with the first step, let's push this code to our github and see the GitHub Action running

![image](https://user-images.githubusercontent.com/14299807/202889462-00a89eb4-6a89-4d34-87e3-d18302c3eed8.png)
![image](https://user-images.githubusercontent.com/14299807/202889492-1a85ded3-bb77-4d2d-ac5f-9c1ddf8c329a.png)
![image](https://user-images.githubusercontent.com/14299807/202889498-2159e569-17cc-48b0-b82f-4e8c423eb24c.png)

# Install SFDX CLI in pipeline
Now, as we are done with the simple pipeline and we have also done with the steps for authentication with Salesforce! Let's make modification in our pipeline to add a job `build`, here we will perform the steps related to Salesforce Deployment. The first step in this pipeline would be installing the SFDX and testing if the SFDX has been installed or not

In your pipeline yml file add the below code
````yml
build:
    runs-on: ubuntu-latest
    steps:
      # Checkout the Source code from the latest commit
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          
      - name: Install NPM
        run: |
          npm install
      # Install the SFDX CLI using npm command
      - name: Install the SFDX CLI
        run: |
          npm install sfdx-cli --global
          sfdx force --help
````
If you are making the changes into the Github directly, then commit the changes and see the magic. If you are making the changes in local repo then you need to commit and push the changes to remote branch.

> Note: The indentation is very important in the pipeline. So you need to be very careful. You can use [Online YML Validator](https://codebeautify.org/yaml-validator) to validate your YML file

Here is the `yml` file after making the above changes
````yml
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
      
  build:
    runs-on: ubuntu-latest
    steps:
      # Checkout the Source code from the latest commit
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          
      - name: Install NPM
        run: |
          npm install
      # Install the SFDX CLI using npm command
      - name: Install the SFDX CLI
        run: |
          npm install sfdx-cli --global
          sfdx force --help
````
![image](https://user-images.githubusercontent.com/14299807/202890065-8593f4a4-a170-4492-8cb4-f1dc633c5405.png)
![image](https://user-images.githubusercontent.com/14299807/202890093-409cd78e-c6db-4ac8-90ca-1553f9a44bb1.png)

# Authenticate to Salesforce in Pipeline
In the above step we have successfully installed the SFDX Pipeline the next step is authenticate to Salesforce ORG so that we can perform the validation or deployment.

### Decrypt the `server.key.enc` file 

- Remember we encrypted the `server.key` file at the initial steps and placed the outcome inside `assets` folder
- Decrypt the `server.key.enc` file  to get the `server.key` at runtime to make sure that we have the private key to establish the connection with Salesforce using JWT method.
- Add one more step within `build` job to decrypt the key. use below command

````yml
- name: Decrypt the server.key.enc file & store inside assets folder
        run: |
          openssl enc -nosalt -aes-256-cbc -d -in server.key.enc -out server.key -base64 -K <YOUR_KEY_VALUE> -iv <YOUR_IV_VALUE>
````
> Note:- Use your key & iv value that you generated at very first step

![image](https://user-images.githubusercontent.com/14299807/202891826-cc38d67d-8df4-4ca6-874f-c0edc79ed5c4.png)

### Authenticate to Salesforce using Pipeline
After we have decrypted the `server.key` in the previous and have got the key file that we need to for authentication. Now, the time is to authenticate to Salesforce Username using JWT. Below is the command for authentication
````cmd
sfdx force:auth:jwt:grant --clientid YOUR_CLIENT_ID --jwtkeyfile assets/server.key --username SALESFORCE_USERNAME --setdefaultdevhubusername -a HubOrg
````
#### Note
> Replace YOUR_CLIENT_ID with the your salesforce connected app consumer key
> Replace SALESFORCE_USERNAME with the salesforce deployment username

After making the changes, commit & push those changes to remote branch and see the outcome! You must see the success message like below
![image](https://user-images.githubusercontent.com/14299807/202892367-688da254-9257-4f41-912d-fafcd427cf0c.png)

### Validate the code base to Salesforce Org
Congratulations 🎉, You have successfully authenticated to Salesforce Org. Now, the last step that is remaining is validating the code base to Salesforce Org. To validate/deploy the code base use below sfdx command
````cmd
sfdx force:source:deploy -p force-app -c -u HubOrg
````
#### Where
- `-p` path to source code
- `-c` remove this if you want to deploy. -c is used to indicate that the code will be valitated but not deployed
- `-u` the target org username that is HubOrg as we have used HubOrg as alias in the authentication command

![image](https://user-images.githubusercontent.com/14299807/202892963-509076a0-4052-444c-8b54-4c340244347c.png)

> If you want to do the direct deployment then remove `-c` from the above sfdx command

WoooooHoooooo 🎉 You have successfully developed a simple Github Action Pipeline that validates the code against salesforce org everytime a push is happening in the repo.

Here is the complete yml file for your reference
````yml
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
      
  build:
    runs-on: ubuntu-latest
    steps:
      # Checkout the Source code from the latest commit
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          
      - name: Install NPM
        run: |
          npm install
      # Install the SFDX CLI using npm command
      - name: Install the SFDX CLI
        run: |
          npm install sfdx-cli --global
          sfdx force --help
      - name: Decrypt the server.key.enc file & store inside assets folder
        run: |
          openssl enc -nosalt -aes-256-cbc -d -in assets/server.key.enc -out assets/server.key -base64 -K DECRYPTION_KEY -iv DECRYPTION_IV
          
      - name: Authenticate Salesforce ORG
        run: |
          sfdx force:auth:jwt:grant --clientid HUB_CONSUMER_KEY --jwtkeyfile assets/server.key --username HUB_USER_NAME --setdefaultdevhubusername -a HubOrg
      
      - name: Validate Source Code Against Salesforce ORG
        run: |
          sfdx force:source:deploy -p force-app -c -u HubOrg

````

# Path Filteting in Github Action
In the current implementations anytime when the codebase is pushed to any branch then the pipeline is execting and beacuse of this we are validating the codebase even if there is not change in the code base. For example, if you change in the `yml` file then also the pipeline is executing however this should not happen.

So, let's add [path filtering](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-including-paths) in Github Action

To include the path filters, we need to use paths in `on` events like `push` given is the example for the same
````yml
on: 
  push:
    paths:
      - 'force-app/**'
````
Commit and publish the changes, this time you will notice that no action is executed.

> You can use the same concept for other folders as well and for the other events like `pull_request`

# Add Environments in Github Actions
Adding the environment in Github Action is very important because whenever you are making the changes into the codebase and pushing the changes the validation runs against the org. What if you wanted to deploy the code to different environment like Integration, QA, Staging, SIT, & etc and this will be obivious use case. You must be deploying the code to different environment.

### Steps to create environment in Github Actions
1. Open the Repo where you wanted to create environment
2. Click on **Setting** tab to open the settings
3. Locate **Environment** item from the left side
4. Click on **New Environment** to create a New Environment
5. Give a name & click on **Configure Environment**

![image](https://user-images.githubusercontent.com/14299807/202894602-689f2a2d-9e35-408b-8c68-12c8eb59902e.png)

![image](https://user-images.githubusercontent.com/14299807/202894631-7475c2bb-a357-4594-a4a9-a19a94921995.png)

![image](https://user-images.githubusercontent.com/14299807/202894723-0fe21564-1c95-4e1e-b48b-77b0822e4773.png)

> Congratilation :tada: you have created the environment. If you wanted to create more environment then follow the same steps

# Configures Secrets in Github Action Environments
Because we are using the values directoly in the `yml` there are chances that some intrudor can access the information and get the unauthorised access to our Salesforce environment it is always best practice to create the secrets and store all the sensitive information in secrets. For Example, username, key file, client id, login url & etc.

 Also as the requirement is to deploy the code to various environment and the credentials and URL will be different for each Environments.
 
 1. While you are on the environment page 
 2. Click on the `add secret` button under `Environment secrets` section
 3. and add the following secrets for your environment
    - **DECRYPTION_KEY** the value of Key file to decrypt the server.key.inc file
    - **DECRYPTION_IV** the value of IV file to decrypt the server.key.inc file
    - **ENCRYPTION_KEY_FILE** the location to encrypted file that is `assets/server.key.inc`
    - **JWT_KEY_FILE** - the location to place the decrypted key file and the value should be `asset/server.key`
    - **HUB_CONSUMER_KEY** - the salesforce connected application id
    - **HUB_USER_NAME** - the salesforce username that needs to perform the validation/deployment. ( This should be the deployment username )
    - **HUB_LOGIN_URL** - the salesforce login url depending upon either it is salesforce sandbox or production
  4. If you have multiple environment, then please add the secrets across all your environments
    
> You can have the naming as per your need. If you use different name then make sure to refer those names in your pipeline
> If you have multiple environment, then make sure that the variable names are same across all environments

![image](https://user-images.githubusercontent.com/14299807/202895575-1bedf281-6adb-453b-a477-6d038a6cfbb1.png)
 
# Access Environment Secrets in your Pipeline

### Add Environment in build
Because we have setup the environment alsong with the secrets, fist we need to tell our pipeline which environment the salesforce validation should be performed. The first step to modify our job that is `build` and add environment keyword like below
![image](https://user-images.githubusercontent.com/14299807/202895645-ce58f317-add8-4369-88d3-8212e2201273.png)

### Refer secrets in the steps
- To access the secrets within Github Action pipeline we need to first use $ followed by double opening flower brackets( {{ ) & double closing flower brackets( }} ). Example ` ${{ }} `.
- Withing the flower brackets use `secrets` keyword followed by the period `.` statement followed by the name of the secrets. For Example - `${{ secrets.DECRYPTION_KEY }}`
- Replace all the hardcoding values with the secrets that you have just created.
- Below is the modified code for the `build` job

````yml
build:
    runs-on: ubuntu-latest
    environment: developer
    steps:
      # Checkout the Source code from the latest commit
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          
      - name: Install NPM
        run: |
          npm install
      # Install the SFDX CLI using npm command
      - name: Install the SFDX CLI
        run: |
          npm install sfdx-cli --global
          sfdx force --help
      - name: Decrypt the server.key.enc file & store inside assets folder
        run: |
          openssl enc -nosalt -aes-256-cbc -d -in ${{ secrets.ENCRYPTION_KEY_FILE }} -out ${{ secrets.JWT_KEY_FILE }} -base64 -K ${{ secrets.DECRYPTION_KEY }} -iv ${{ secrets.DECRYPTION_IV }}
          
      - name: Authenticate Salesforce ORG
        run: |
          sfdx force:auth:jwt:grant --clientid ${{ secrets.HUB_CONSUMER_KEY }} --jwtkeyfile  ${{ secrets.JWT_KEY_FILE }} --username ${{ secrets.HUB_USER_NAME }} --setdefaultdevhubusername -a HubOrg --instanceurl ${{ secrets.HUB_LOGIN_URL }} 
      
      - name: Validate Source Code Against Salesforce ORG
        run: |
          sfdx force:source:deploy -p force-app -c -u HubOrg
````

Commit and publish the changes. You will see that no Action is running because no changes has been made to code base.

### Test Environment based validation/deployment
To test the deployment or validation under the environment in my case `developer` make any changes in code base and publish the changes. You will clearly see that it is deploying on mentioned environment.
![image](https://user-images.githubusercontent.com/14299807/202896010-821d3f82-7511-4891-b630-5d3d664b4415.png)

If all the values are correct then you see the success job like below

![image](https://user-images.githubusercontent.com/14299807/202896148-72c80c47-2c7b-43fe-8045-21ed4bbcf432.png)

# Work with Pull Request in Github Action
It is ok to run the pipeline everytime when there is a change in codebase pushed to remote branch however when it comes to higher environment like qa, staging, integration or production then the pipeline should only execute when there is a pull_request raised and closed successfully.

### Modify the developer pipeline
To take the most out of Pull Request concept using Pipeline we need to make the following changes in our existing pipeline. 
- Add `branches` filter in the push event
- Below is the code for your reference

````yml
on: 
  push:
    branches:
      - feature/*
    paths:
      - 'force-app/**'
````

### Create a new pipeline
We have successfully created and tested the pipeline for developer environment and branch. Now let's create another pipeline that will execute when the pull request is raised to master branch and it is merged. 

- Create a new pipeline inside `.github/workflow` folder. You can give it any name, I will use `production.yml`
- Copy and paste the same code as `github-actions.yml`
- Change the environment to `production` under `build` job. Note:- This will require to create a new environment with name `production` and secrets setup
- Change the name to `Production Pipeline`
- change the `run-name` to `${{ github.actor }} is running pipeline on ${{ github.repository }}`
- for `on` use below code

````yml
on: 
  pull_request:
    types: [closed]
    branches:
      - master
      - main
    paths:
      - 'force-app/**'
````
#### Where
- **branches**: This pipeline should only execute when there is a PR raised to `master` branch
- **types**: Pipeline will execute only when the PR is closed. You can see all values from [Official Document](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request)
- **paths**: only execute the pipeline when there is change in `force-app` folder that is codebase

### Create a New Branch
Because we have setup a production pipeline, to test the pipeline do follow the below steps
- Create a branch out of `maste or main` branch and name it developer
- Make change in codebase in `developer` branch
- Create a Pull request from `developer` branch to `master` or `main` branch
- Merge the PR
- Notice that the Pipeline on Master branch has been executed

![image](https://user-images.githubusercontent.com/14299807/202898775-ab2a2c50-b6c5-44ad-9b79-297d23bfaa4d.png)
![image](https://user-images.githubusercontent.com/14299807/202898807-c8e27141-663d-479d-8371-082805ff4869.png)
![image](https://user-images.githubusercontent.com/14299807/202898828-41a72d5a-1342-4132-a61b-e8d9d743b110.png)
![image](https://user-images.githubusercontent.com/14299807/202898894-c3bc9c77-e4b1-4827-95ab-bdfbaddf71c4.png)
 
If everything looks ok then you will see the success build like below
![image](https://user-images.githubusercontent.com/14299807/202898976-12478514-8607-4747-9308-1a66b5964e39.png)

# Work with Delta Deployment
Delta deployment is very important these days to achieve the selective deployment because in our current approach we are deploying everythin that is inside `force-app` no matter if we have changes in a single apex class it will deploy all the apex classes.

Because we are using sfdx deployment, we will be using a SFDX Plugin to generate the data at the run time. The plugin [sfdx-git-delta](https://github.com/scolladon/sfdx-git-delta) is very helpful. This plugin is available for free and does not requires any licencing. 

Delta deployment will be helpful when we are deploying to higher environment using Pull Request.

### Create .sgdignore file
To make the Delta deployment using sfdx plugin, it is important to create the .sgdignore file and add the below content. We are creating this file becuase if you change .yml file in the repo then plugin will consider this file as `workflow` and a new entry will be added in `package.xml` which will fail the deplpyment.
> The file must be at the topmost directory at the same level of `force-app` folder
````yml
# Github Actions
.github/
.github/workflow
````

### Install the sfdx-git-delta plugin in Pipeline
To install the plugin, add the new step before decryping the `sever.key.inc` file after the SFDX Intallation step
````yml
- name: Install the sfdx-git-delta plugin
  run: |
    echo 'y' | sfdx plugins:install sfdx-git-delta
````
![image](https://user-images.githubusercontent.com/14299807/202899508-b119c08c-554d-4bee-b2b4-663ec4e50c7f.png)

### Generate package.xml for changed components only
When we talk about the delta deployment that means we need to generate the `package.xml` at run time and the package.xml will contain only the component that has been changed by the developer.

Add the below step after the authentication with Salesforce
````yml
- name: Generate the package.xml for delta files
  run: |
    mkdir delta
    sfdx sgd:source:delta --to "HEAD" --from "HEAD~1" --output "./delta" --ignore-whitespace -d -i .sgdignore
    echo "--- package.xml generated with added and modified metadata ---"
    cat delta/package/package.xml
````

### Deploy delta components to Salesforce
After you have generated the `package.xml` with the changed components only. Add the step to deploy the delta components to salesforce
````yml
- name: Deploy Delta components to Salesofrce
  run: |
    sfdx force:source:deploy -x delta/package/package.xml -c -l RunLocalTests -u HubOrg
````
Commit & publish the yml file.
> Note- Delete the other deployment step

### Test the delta deployment
Because we are done with the changes that we need in the pipeline .yml file. Let's make some changes into the code base while we are on the `developer` branch.
Create a pull request and merge the changes.

Click on the build Job to see the outcome of your Job. You will see the outcome like below
![image](https://user-images.githubusercontent.com/14299807/202900879-11271284-0808-41f3-b2d2-271285f67b30.png)

The deployment is failing due to some code coverage. If everything is ok your pipeline will be success
![image](https://user-images.githubusercontent.com/14299807/202900932-8bd9106e-1179-4ec5-8827-ae5d284479d4.png)

### Final Code for Production Pipeline
````yml
name: Production Pipeline
run-name: ${{ github.actor }} is running pipeline on ${{ github.repository }}
on: 
  pull_request:
    types: [closed]
    branches:
      - master
      - main
    paths:
      - 'force-app/**'
      
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
      
  build:
    runs-on: ubuntu-latest
    environment: production
    steps:
      # Checkout the Source code from the latest commit
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          
      - name: Install NPM
        run: |
          npm install
      # Install the SFDX CLI using npm command
      - name: Install the SFDX CLI
        run: |
          npm install sfdx-cli --global
          sfdx force --help
          
      - name: Install the sfdx-git-delta plugin
        run: |
          echo 'y' | sfdx plugins:install sfdx-git-delta
          
      - name: Decrypt the server.key.enc file & store inside assets folder
        run: |
          openssl enc -nosalt -aes-256-cbc -d -in ${{ secrets.ENCRYPTION_KEY_FILE }} -out ${{ secrets.JWT_KEY_FILE }} -base64 -K ${{ secrets.DECRYPTION_KEY }} -iv ${{ secrets.DECRYPTION_IV }}
          
      - name: Authenticate Salesforce ORG
        run: |
          sfdx force:auth:jwt:grant --clientid ${{ secrets.HUB_CONSUMER_KEY }} --jwtkeyfile  ${{ secrets.JWT_KEY_FILE }} --username ${{ secrets.HUB_USER_NAME }} --setdefaultdevhubusername -a HubOrg --instanceurl ${{ secrets.HUB_LOGIN_URL }} 
      
      - name: Generate the package.xml for delta files
        run: |
          mkdir delta
          sfdx sgd:source:delta --to "HEAD" --from "HEAD~1" --output "./delta" --ignore-whitespace -d -i .sgdignore
          echo "--- package.xml generated with added and modified metadata ---"
          cat delta/package/package.xml
      
      - name: Deploy Delta components to Salesofrce
        run: |
          sfdx force:source:deploy -x delta/package/package.xml -c -l RunLocalTests -u HubOrg
````

# Integrate the Static Code Analysis Tool
It is very important that we keep our code clean that follows all the best practices to get rid of technical dept in your code, making sure the code is not vulnerable, and other security issues are being taken care at the early stage of the development

### Install the SFDX CLI Scanner
Because Salesforce has it's own plugin to perform the static code analysis. We will be using [SFDX CLI Scanner](https://forcedotcom.github.io/sfdx-scanner/) plugin to analysis the code vulnerable.

Add the step to install the scanner in your pipeline before deployment step
````yml
- name: Install the SFDX CLI Scanner
  run: |
    echo 'y' | sfdx plugins:install @salesforce/sfdx-scanner
````

### Run the Code Analysis tool in repo
The above step will install the scanner and now, we need to run the Scanner to scan all our code and generate the report. Add a nee Step to scan the code
````yml
- name: Run SFDX CLI Scanner
  run: |
    sfdx scanner:run -f html -t "force-app" -e "eslint,retire-js,pmd,cpd" -c "Design,Best Practices,Code Style,Performance,Security" --outfile ./reports/scan-reports.html
````

### Upload the Scan report as Artifacts
It is very important to store the scan result as artifacts so that developers can download and refer the reports to make the changes into the code that may cause the technical debt
````yml
- uses: actions/upload-artifact@v3
  with:
    name: cli-scan-report
    path: reports/scan-reports.html
````
![image](https://user-images.githubusercontent.com/14299807/202902177-77f65a7f-0fc8-4ea7-b1f0-4a8be537ac26.png)

