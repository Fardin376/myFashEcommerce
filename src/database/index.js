import mongoose from 'mongoose';

export const configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const connectToDB = async () => {
  const connectionUrl =
    'mongodb+srv://myFashAdmin:myFashAdmin12345@cluster0.hhqwcqm.mongodb.net/';

  try {
    mongoose.connect(connectionUrl, configOptions);

    console.log('Connected to database.');
  } catch (error) {
    console.log(`Could not connect to database. ${error.message}`);
  }
};

export default connectToDB;
