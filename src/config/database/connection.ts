
import mongoose, { Mongoose } from "mongoose";
import bluebird from "bluebird";

export const DBConnect = async (mongoUrl: string) => {
  mongoose.Promise = bluebird;

  const connectionP = new Promise<Mongoose>((res, rej) => {

    mongoose.connect(mongoUrl).then(
      (ins) => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */


        console.log("Mongo connected!!!");
        console.log(`Using mongo host '${mongoose.connection.host}' and port '${mongoose.connection.port}'`);
        return res(ins);
      },
    ).catch(err => {
      console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
      // process.exit();
      return rej(err);
    });

  });

  return connectionP;
};
