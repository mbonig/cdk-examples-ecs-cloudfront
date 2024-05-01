import { Stage, StageProps, Tags } from 'aws-cdk-lib';
import { ManualApprovalStep, StackSteps } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { CdnStack } from '../stacks/CdnStack';
import { DatabaseStack, DatabaseStackProps } from '../stacks/DatabaseStack';
import { VpcStack, VpcStackProps } from '../stacks/VpcStack';
import { WebsiteStack, WebsiteStackProps } from '../stacks/WebsiteStack';

interface ApplicationStageProps extends StageProps, DatabaseStackProps, Omit<WebsiteStackProps, 'tables' | 'vpc'> {
  vpc: VpcStackProps;
  envTag: string;
}

export class ApplicationStage extends Stage {
  stackSteps: StackSteps[] = [];

  constructor(scope: Construct, id: string, props: ApplicationStageProps) {
    super(scope, id, props);

    const vpcStack = new VpcStack(this, 'Vpc', { ...props, ...props.vpc });

    const database = new DatabaseStack(this, 'Database', {
      ...props,
      tablePrefix: props.tablePrefix,
    });
    this.stackSteps.push({
      stack: database,
      changeSet: [
        new ManualApprovalStep('ChangesetApproval', {
          comment: 'Please review the changesets',
        }),
      ],
    });

    const website = new WebsiteStack(this, 'Website', {
      tables: database.tables,
      ...props,
      vpc: vpcStack.vpc,
    });

    new CdnStack(this, 'CDN', {
      websiteLoadBalancer: website.loadBalancer,
      certificate: website.certificate,
      ...props,
    });

    Tags.of(this).add('env', props.envTag);

  }

}
