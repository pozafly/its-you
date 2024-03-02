import type { ViewSubmitAction } from '@slack/bolt';
import { App } from '@slack/bolt';
import './utils/env';
import commands from './handlers/commands';
import responseModal from './handlers/responseModal';
import insertAllUsers from './handlers/insertAllUsers';

// init
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

/**
 * event 등록
 * action : 모달에서 '전체 선택' 버튼 클릭 시
 * view: 모달에서 '제출' 버튼 클릭 시
 */
//
app.command('/random', commands);
app.action('insert_all_users', insertAllUsers);
app.view<ViewSubmitAction>('random', responseModal);

// start
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
