import sequelize from './config/database';
import Logger from './config/logger';
import { app } from './app';

sequelize
  .sync({ alter: true })

  .then(() => {
    app.listen(process.env.APP_PORT, () => Logger.info(`Server is live at port:${process.env.APP_PORT}`));
  })
  .catch((err) => {
    Logger.error(err);
  });
