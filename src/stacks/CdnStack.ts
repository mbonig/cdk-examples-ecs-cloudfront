import { Stack, StackProps } from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
  Distribution,
  OriginProtocolPolicy,
  OriginRequestPolicy,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { LoadBalancerV2Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { ILoadBalancerV2 } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { ARecord, HostedZone } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import { WebsiteStackTest } from '../constructs/WebsiteStackTest/WebsiteStackTest';

interface CDNStackProps extends StackProps {
  websiteHost: string;
  domainName: string;
  certificate: ICertificate;
  websiteLoadBalancer: ILoadBalancerV2;
}

export class CdnStack extends Stack {
  constructor(scope: Construct, id: string, props: CDNStackProps) {
    super(scope, id, props);
    const websiteFqdn = `${props.websiteHost}.${props.domainName}`;
    const originRequestPolicy = new OriginRequestPolicy(this, 'OriginRequestPolicy', {
      headerBehavior: {
        behavior: 'allViewer',
      },
    });
    const distribution = new Distribution(this, 'Resource', {
      defaultBehavior: {
        origin: new LoadBalancerV2Origin(props.websiteLoadBalancer, {
          protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
        }),
        originRequestPolicy: {
          originRequestPolicyId: originRequestPolicy.originRequestPolicyId,
        },
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      certificate: props.certificate,
      domainNames: [websiteFqdn],
    });
    const hostedZone = HostedZone.fromLookup(this, 'HostedZone', { domainName: props.domainName });

    const record = new ARecord(this, 'AliasRecord', {
      recordName: props.websiteHost,
      zone: hostedZone,
      target: {
        aliasTarget: new CloudFrontTarget(distribution),
      },
    });

    const tests = new WebsiteStackTest(this, 'UrlPingTest', {
      url: `https://${websiteFqdn}`,
    });
    tests.node.addDependency(record);

  }

}
