import { awscdk } from 'projen';
import { LambdaRuntime } from 'projen/lib/awscdk';

const project = new awscdk.AwsCdkTypeScriptApp({
  experimentalIntegRunner: true,
  cdkVersion: '2.139.0',
  defaultReleaseBranch: 'main',
  name: 'reinvent',
  projenrcTs: true,
  maxNodeVersion: '18.18.0',
  lambdaOptions: {
    runtime: LambdaRuntime.NODEJS_18_X,
  },
  deps: [
    '@aws-cdk/aws-lambda-python-alpha@^2.132.0-alpha.0',
    '@aws-sdk/client-dynamodb',
    '@aws-sdk/lib-dynamodb',
    '@cdktf/aws-cdk',
    '@matthewbonig/state-machine',
    '@matthewbonig/cdk-logical-id-mapper',
    '@types/node@^18',
    '@types/uuid',
    '@wheatstalk/cdk-intrinsic-validator',
    'aws-cdk-github-oidc',
    'aws-sdk',
    'cdk-iam-floyd',
    'cdk-nag',
    'cdk-pipelines-github',
    'datadog-cdk-constructs-v2',
    'uuid',
  ],
  context: {
    ECS_REMOVE_DEFAULT_DESIRED_COUNT: 'true',
  },
});

project.synth();
