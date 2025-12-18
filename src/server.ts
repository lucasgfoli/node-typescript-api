import { Server } from '@overnightjs/core';
import './util/module-alias';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';
import * as database from '@src/database'
import { BeachesController } from './controllers/beaches';
import { UsersController } from './controllers/users';
import logger from './logger';

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
