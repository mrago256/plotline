import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { EntryType } from "../constants/enums";
import { QueryResult, SavedEntry } from "../constants/types";

const client = new DynamoDBClient({ region: "us-east-1", profile: "plotline" }); // profile for dev only
const docClient = DynamoDBDocumentClient.from(client);

const movieTableName = "plotline-movies"
const showTableName = "plotline-shows"

export async function getSavedList(entryType: EntryType): Promise<SavedEntry[]> {
    const command = new ScanCommand({
        "TableName": entryType == EntryType.movie ? movieTableName : showTableName
    });

    const response = await docClient.send(command);

    const statusCode = response.$metadata.httpStatusCode
    if (statusCode != 200) {
        throw new Error(`Failed to fetch items - ${statusCode}`);
    }

    return response.Items as SavedEntry[];
}

export async function saveMovie(movie: QueryResult): Promise<void> {
    await saveEntry(movie, movieTableName);
}

export async function saveShow(show: QueryResult): Promise<void> {
    await saveEntry(show, showTableName);
}

async function saveEntry(entry: QueryResult, table: string): Promise<void> {
    const itemToPut = entry as SavedEntry;

    itemToPut.personalRating = null;
    itemToPut.watched = false;
    itemToPut.dateAdded = Math.floor(Date.now() / 1000);

    const command = new PutCommand({
        TableName: table,
        Item: itemToPut
    });

    const response = await docClient.send(command);

    const statusCode = response.$metadata.httpStatusCode
    if (statusCode != 200) {
        throw new Error(`Failed to save item - ${statusCode}`);
    }
}
