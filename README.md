# ECS with CloudFront

This is a simple example of how to deploy an ECS service with CloudFront in front of it. 

## Architecture

![Architecture](./diagram.png)

This example consists of one primary stack and a few application stacks wrapped in a stage:

1. [PipelineStack](./src/stacks/PipelineStack.ts) - This stack creates the CodePipeline and CodeBuild resources that are used to deploy the application stacks.
2. [ApplicationStage](./src/stages/ApplicationStage.ts) - A stage to contain all the application stacks.
3. [VpcStack](./src/stacks/VpcStack.ts) - This stack creates the VPC for the cluster to reside in.
4. [DatabaseStack](./src/stacks/DatabaseStack.ts) - This stack creates the DynamoDB table for the application.
5. [WebsiteStack](./src/stacks/WebsiteStack.ts) - This stack creates the ECS cluster, a bucket to hold media, and the ALB for the cluster.
6. [CdnStack](./src/stacks/CdnStack.ts) - This stack creates the CloudFront distribution for the website.

## Points of Interest

The following are a few points of interest I suggest you look at:

* The `PipelineStack` Stack creates the CodePipeline and CodeBuild resources via the L3 CodePipeline construct which is purpose-built for deploying CDK application across environments.
* The `ApplicationStage` Stage extends interfaces from the stacks. Any properties on the stacks that are created by other stacks are omitted using the `Omit` utility type. E.g. `Omit<WebsiteStackProps, 'tables' | 'vpc'>`, where the WebsiteStackProps is used, but without the tables and vpc properties since those will be provided by other stacks in the stage to the WebsiteStack.
* The stage is responsible for creating a 'stackSteps' property which is used by the pipeline to extend the functionality. This allows the logic of what should require manual approvals to stay close to the stacks that are being deployed.
* Tags are applied within the stage, as aspects do not cross stage boundaries and can't be applied at the PipelineStack scope. This does require the passing of an explicit "envTag" property. If there had been more tags to apply, a map (Record<string,string>) could be used instead of a simple string field.
* The `VpcStack` does not provide properties for overriding the `maxAzs` and `natGateways` properties. This was only done for brevity and most implementations would require these fields to be overridden (e.g. a production deployment would likely want redundancy in the natGateways while a development deployment would likely want to save costs).
* The `DatabaseStack` creates a DynamoDB table which is made available for other stacks to reference using the `tables` property. Additionally, a manual approval step is added to the pipeline for the DatabaseStack to allow for a manual review of the changes before they are applied.
* The `WebsiteStack` contains a construct for verifying that the website is up and running. This uses the [Trigger](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.triggers-readme.html) module.
* The website is a NextJS website in the ./website/ directory and the Docker image is built as part of the CDK application. Any changes to the website will trigger a new build and deployment of the website. This pipeline builds both the CDK code, builds the Docker image, and deploys the both, with the website being part of the ECS service definition. The magic part of this is in the `ApplicationLoadBalancedFargateService` construct in the `WebsiteStack` taking the return value of the `ContainerImage.fromAsset('website')` call.
* To ensure that caching is not performed on the API endpoints a special headers config is added in the [next.config.js](./website/next.config.js) file. This is a common pattern for APIs that are behind a CDN but your specific set up might need to differ (e.g. caching GET requests for unauthenticated users where the results would be the same regardless of the user).
* The `CdnStack` doesn't require any special configuration other than to point at the ALB that is created as part of the `WebsiteStack`. 
