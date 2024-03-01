import { App, GlobalShortcut, ViewSubmitAction } from '@slack/bolt';
import './utils/env';
import { openModal } from './functions/openModal';
import { commandOpenModal } from './functions/commandOpenModal';
import { insertAllUsers } from './functions/insertAllUsers';
import { responseModal } from './functions/responseModal';

// init
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

/**
 * event 등록
 * shortcut: 단축키 실행
 * action : 모달에서 '전체 선택' 버튼 클릭 시
 * view: 모달에서 '제출' 버튼 클릭 시
 */
//
app.shortcut<GlobalShortcut>('random', openModal);
app.command('/random', commandOpenModal);
app.action('insert_all_users', insertAllUsers);
app.view<ViewSubmitAction>('random', responseModal);

// start
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
