import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Transaction } from '@covalenthq/client-sdk';
import { TransactionService } from './transactions.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@WebSocketGateway({
  cors: {
    origin: process.env.PUBLIC_FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class TransactionsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private lastKnownTransactions: Map<string, Transaction[]> = new Map();

  constructor(private transactionsService: TransactionService) {}

  async handleConnection(client: Socket, ...args: any[]) {
    Logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    Logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('checkForNewTransactions')
  async handleCheckForNewTransactions(
    client: Socket,
    payload: {
      address: string;
      network: string;
    },
  ) {
    const { address, network } = payload;

    const transactions: Transaction[] = (
      await this.transactionsService.getTransactions(address, network)
    ).transactions;

    client.emit('newTransactions', transactions);

    this.lastKnownTransactions.set(`${address}-${network}`, transactions);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    Logger.log('Checking for new transactions...');

    for (const [key, value] of this.lastKnownTransactions) {
      const [address, network] = key.split('-');

      const transactions: Transaction[] = (
        await this.transactionsService.getTransactions(address, network)
      ).transactions;

      const newTransactions = transactions.filter(
        (transaction) =>
          !value.some((t: Transaction) => t.tx_hash === transaction.tx_hash),
      );

      if (newTransactions.length > 0) {
        this.server.emit('newTransactions', newTransactions);
        this.lastKnownTransactions.set(key, transactions);
      }
    }
  }
}
