import { App } from 'aws-cdk-lib';
import { CONNECTION_ARN, MANAGEMENT_ACCOUNT, PRIMARY_REGION } from './constants';
import { PipelineStack } from './stacks/PipelineStack';

const app = new App();


new PipelineStack(app, 'CDK-Example-ECS-CloudFront', {
  env: {
    account: MANAGEMENT_ACCOUNT,
    region: PRIMARY_REGION,
  },
  connectionArn: CONNECTION_ARN,
  domainName: 'example.matthewbonig.com',
});

app.synth();
