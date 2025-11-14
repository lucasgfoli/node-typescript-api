import { Server } from '@overnightjs/core';
import './util/module-alias';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';
import * as database from '@src/database'
import { BeachesController } from './controllers/beaches';

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
    this.addControllers([forecastController, beachesController]);
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
}
