import mongoose from "mongoose";
import { Response } from 'express';
import { CUSTOM_VALIDATION } from "@src/models/user";

export abstract class BaseController {
    protected sendCreateUpdateErrorResponse(res: Response, error: mongoose.Error.ValidationError | Error): Response {
        
        if (error instanceof mongoose.Error.ValidationError) {
            const clientErrors = this.handleClientErrors(error);
            return res.status(clientErrors.code).send({ code: clientErrors.code, error: clientErrors.error });
        }
        else {
            return res.status(500).send({ code: 500, error: 'Something Went Wrong' });
        }

    }

    private handleClientErrors(error: mongoose.Error.ValidationError): { code: number; error: string } {
        const duplicatedKindErrors = Object.values(error.errors).filter((err) => err.kind === CUSTOM_VALIDATION.DUPLICATED);

        if (duplicatedKindErrors.length) {
            return { code: 409, error: error.message };
        } else
            return { code: 422, error: error.message };
    }
}