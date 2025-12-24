import { Server } from '@overnightjs/core';
import { Application } from 'express';
import { ForecastController } from './controllers/forecast';
import { BeachesController } from './controllers/beaches';
import { UsersController } from './controllers/users';
import * as database from '@src/database'
import './util/module-alias';
import bodyParser from 'body-parser';
import logger from './logger';
import expressPino from 'express-pino-logger';
import cors from 'cors';

export class SetupServer extends Server {
  // Extends herda todas as funcionalidades da classe Server do @overnightjs/core, mas pode adicionar suas próprias coisas.

  constructor(private port = 3000) {
    super(); // Inicializa construtor da classe Pai.
  }

  public async init(): Promise<void> {
    this.setupExpress(); // To comment
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    // Método que só poderá ser utilizado dentro da classe.
    this.app.use(bodyParser.json());
    this.app.use(expressPino(logger));
    this.app.use(cors({
      origin: '*',
    }));
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();

    this.addControllers([forecastController, beachesController, usersController]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    // Tipagem explícita
    return this.app;
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info('Server listening of port' + this.port)
    });
  }
}
