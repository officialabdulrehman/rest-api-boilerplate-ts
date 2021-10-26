import multer from "multer";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
      
const fileFilter = (req: Request, file: any, cb: any) => {
        if (
                file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg" ||
                file.mimetype === "application/msword" ||
                file.mimetype === "application/pdf" ||
                file.mimetype === "text/plain"
        ) {
                cb(null, true);
        } else {
                cb(null, false);
        }
};
export const multerUpload = multer({ dest: "data/uploads/", fileFilter: fileFilter, limits: { fileSize: 25600000} });

export const readFileFromStream = async (path: string): Promise<string> => {
        const chunks: Array<Uint8Array> = [];
        const promise = new Promise<Buffer>((res, rej) => {
                const rs = fs.createReadStream(path);
                rs.on("error", (err) => {
                        return rej(err);
                });

                rs.on("data", chunk => {
                        chunks.push(chunk);
                });

                rs.on("close", () => {
                        return res(Buffer.concat(chunks));
                });
        });

        const data = await promise;
        const res = data.toString("utf8");
        return res;
};

export const deleteFile = async (path: string) => {
        const promise = new Promise<void>((res, rej) => {
                fs.lstat(path, (err, stats) => {
                        if(err){
                                return rej(err);
                        }

                        if (!stats.isFile()) {
                                throw new Error("Can only delete files");
                        }

                        fs.unlink(path, (err) => {
                                if (err) {
                                        return rej(err);
        
                                }
        
                                return res();
                        });
                });                
        });

        return promise;
};