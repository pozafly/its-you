import commands from './handlers/commands';
import responseModal from './handlers/responseModal';
import insertAllUsers from './handlers/insertAllUsers';

import {
  SlackApp,
  SlackEdgeAppEnv,
  ExecutionContext,
} from 'slack-cloudflare-workers';

export default {
  async fetch(
    request: Request,
    env: SlackEdgeAppEnv,
    ctx: ExecutionContext
  ): Promise<Response> {
    const app = new SlackApp({ env });
    app.command('/random', async () => {}, commands);
    app.action('insert_all_users', async () => {}, insertAllUsers);
    app.view('random', async () => {}, responseModal);

    return await app.run(request, ctx);
  },
};
