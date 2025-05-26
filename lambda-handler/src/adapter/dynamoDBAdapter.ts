import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { UpdateExpression } from "aws-sdk/clients/dynamodb";
import { EntryType } from "../constants/enums";
import { QueryResult, SavedEntry } from "../constants/types";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const movieTableName = "plotline-movies"
const showTableName = "plotline-shows"

export const dynamoDBAdpater = {
    async getSavedList(entryType: EntryType): Promise<SavedEntry[]> {
        const command = new ScanCommand({
            "TableName": entryType === EntryType.movie ? movieTableName : showTableName
        });

        const response = await docClient.send(command);

        const statusCode = response.$metadata.httpStatusCode
        if (statusCode != 200) {
            throw new Error(`Failed to fetch items - ${statusCode}`);
        }

        return response.Items as SavedEntry[];
    },

    async saveNewMovie(movie: QueryResult): Promise<void> {
        await saveEntry(movie, movieTableName);
    },

    async saveNewShow(show: QueryResult): Promise<void> {
        await saveEntry(show, showTableName);
    },

    async updateWatchedMovie(tmdbId: number, watched: boolean): Promise<void> {
        const updateExpression = `set watched = :watched, dateWatched = :dateWatched`;
        const expressionValues = {
            ":watched": watched,
            ":dateWatched": watched ? Math.floor(Date.now() / 1000) : null
        }

        await updateEntry(tmdbId, movieTableName, updateExpression, expressionValues);
    },

    async updateWatchedShow(tmdbId: number, watched: boolean): Promise<void> {
        const updateExpression = `set watched = :watched, dateWatched = :dateWatched`;
        const expressionValues = {
            ":watched": watched,
            ":dateWatched": watched ? Math.floor(Date.now() / 1000) : null
        }

        await updateEntry(tmdbId, showTableName, updateExpression, expressionValues);
    },

    async updateMovieRating(tmdbId: number, rating: number): Promise<void> {
        const updateExpression = `set personalRating = :rating`;
        const expressionValues = {
            ":rating": rating
        };

        await updateEntry(tmdbId, movieTableName, updateExpression, expressionValues);
    },

    async updateShowRating(tmdbId: number, rating: number): Promise<void> {
        const updateExpression = `set personalRating = :rating`;
        const expressionValues = {
            ":rating": rating
        };

        await updateEntry(tmdbId, showTableName, updateExpression, expressionValues);
    },

    async deleteMovie(tmdbId: number): Promise<void> {
        await deleteEntry(tmdbId, movieTableName);
    },

    async deleteShow(tmdbId: number): Promise<void> {
        await deleteEntry(tmdbId, showTableName);
    }
}

async function updateEntry(tmdbId: number, table: string, updateExpression: UpdateExpression, expressionValues?: any) {
    const command = new UpdateCommand({
        TableName: table,
        Key: {
            tmdbId: tmdbId
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionValues
    });

    const response = await docClient.send(command);

    const statusCode = response.$metadata.httpStatusCode;
    if (statusCode != 200) {
        throw new Error(`Failed to update item - ${statusCode}`);
    }
}

async function deleteEntry(tmdbId: number, table: string): Promise<void> {
    const command = new DeleteCommand({
        TableName: table,
        Key: {
            tmdbId: tmdbId
        }
    });

    const response = await docClient.send(command);

    const statusCode = response.$metadata.httpStatusCode;
    if (statusCode != 200) {
        throw new Error(`Failed to delete item - ${statusCode}`);
    }
}

async function saveEntry(entry: QueryResult, table: string): Promise<void> {
    const itemToPut = entry as SavedEntry;

    itemToPut.personalRating = null;
    itemToPut.dateWatched = null;
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
