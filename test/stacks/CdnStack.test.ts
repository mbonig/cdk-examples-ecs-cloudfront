import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { CdnStack } from '../../src/stacks/CdnStack';

test('CdnStack Snapshot', () => {
  const app = new App();
  const extraStack = new Stack(app, 'Extras', {
    env: {
      account: '000011112222', region: 'us-east-1',
    },
  });
  const domainName = 'example.com';
  const stack = new CdnStack(app, 'test', {
    certificate: new Certificate(extraStack, 'Certificate', {
      domainName: domainName,
    }),
    domainName,
    websiteHost: 'test',
    websiteLoadBalancer: new ApplicationLoadBalancer(extraStack, 'LoadBalancer', {
      vpc: new Vpc(extraStack, 'Vpc'),
    }),
    env: {
      account: '000011112222', region: 'us-east-1',
    },
  });

  const assert = Template.fromStack(stack);
  expect(assert.toJSON()).toMatchSnapshot();
});
