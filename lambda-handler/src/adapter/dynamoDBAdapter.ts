import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { QueryResult, SavedEntry } from "../constants/types";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1", profile: "plotline" }); // profile for dev only - doesn't work rn
const docClient = DynamoDBDocumentClient.from(client);
const movieTableName = "plotline-movies"
const showTableName = "plotline-shows"

export async function addMovieToList(movie: QueryResult) {
    const itemToPut = movie as SavedEntry;

    itemToPut.personalRating = null;
    itemToPut.watched = false;

    const command = new PutCommand({
        TableName: movieTableName,
        Item: itemToPut
    });

    const response = await docClient.send(command);
    console.log("write response:", response);
}

export async function getMoviesList(): Promise<SavedEntry[]> {
    const command = new ScanCommand({
        "TableName": movieTableName
    });

    const response = await docClient.send(command);
    console.log("Response:", response.Items);

    return response.Items; //need to test what this is
}
