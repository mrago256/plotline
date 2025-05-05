import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Billing, Capacity, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class PlotlineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const movieTable = this.createDynamoTable("plotline-movies", "tmdb-id");
        const showTable = this.createDynamoTable("plotline-shows", "tmdb-id");
    }

    private createDynamoTable(tableName: string, partitionKey: string): TableV2 {
        return new TableV2(this, tableName, {
            tableName: tableName,
            partitionKey: { name: partitionKey, type: AttributeType.STRING },
            billing: Billing.provisioned({
                readCapacity: Capacity.fixed(3),
                writeCapacity: Capacity.autoscaled({ minCapacity: 3, maxCapacity: 3 })
            }),
        });
    }
}
