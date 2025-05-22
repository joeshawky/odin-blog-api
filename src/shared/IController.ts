import { Request, Response, NextFunction } from "express";
export interface IController {
    handle(req: Request, res: Response): Promise<void>;
}
