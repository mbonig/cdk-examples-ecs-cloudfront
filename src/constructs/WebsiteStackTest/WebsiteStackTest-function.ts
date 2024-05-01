// ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * Props for WebsiteStackTestFunction
 */
export interface WebsiteStackTestFunctionProps extends lambda.FunctionOptions {
}

/**
 * An AWS Lambda function which executes src/constructs/WebsiteStackTest/WebsiteStackTest.
 */
export class WebsiteStackTestFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props?: WebsiteStackTestFunctionProps) {
    super(scope, id, {
      description: 'src/constructs/WebsiteStackTest/WebsiteStackTest.lambda.ts',
      ...props,
      runtime: new lambda.Runtime('nodejs18.x', lambda.RuntimeFamily.NODEJS),
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../assets/constructs/WebsiteStackTest/WebsiteStackTest.lambda')),
    });
    this.addEnvironment('AWS_NODEJS_CONNECTION_REUSE_ENABLED', '1', { removeInEdge: true });
  }
}