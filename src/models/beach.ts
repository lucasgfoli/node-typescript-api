import mongoose, { Document, Model, Schema } from "mongoose";

export enum BeachPosition {
    S = 'S',
    E = 'E',
    W = 'W',
    N = 'N'
}

export interface Beach {
    _id?: string; 
    name: string;
    position: BeachPosition;
    lat: number;
    lng: number;
    user?: string;
}

const schema = new mongoose.Schema<BeachModel>(
    {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        name: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
        position: {
            type: String,
            enum: Object.values(BeachPosition),
            required: true 
        },
    },
    {
        toJSON: {
            transform(_doc, ret: Record<string, unknown>) {

                const obj = ret as {[key: string]: unknown}

                obj.id = obj._id;
                delete obj._id
                delete obj.__v;
                return obj;
            },
        },
    }
);

interface BeachModel extends Document, Omit<Beach, '_id'> {}

export const Beach: Model<BeachModel> = mongoose.model('Beach', schema);