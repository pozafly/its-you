import type { View } from '@slack/bolt';

type Props = {
  channelId: string;
  members?: string[];
  isInitModal?: boolean;
};

export default function generateBlocks({
  channelId,
  members = [],
  isInitModal = false,
}: Props): View {
  const privateMetadata = JSON.stringify({ members, channelId });

  return {
    type: 'modal',
    callback_id: 'random',
    private_metadata: privateMetadata,
    title: {
      type: 'plain_text',
      text: '울룰루!',
      emoji: true,
    },
    submit: {
      type: 'plain_text',
      text: '제출',
      emoji: true,
    },
    close: {
      type: 'plain_text',
      text: '취소',
      emoji: true,
    },

    blocks: [
      {
        type: 'input',
        // NOTE: view.update를 사용할 경우, 변경하고 싶은 element의 block_id가 변경되어야 value 등의 내용이 달라짐.
        // https://stackoverflow.com/questions/72788906/slack-block-kit-plain-text-input-element-update-text-value
        block_id: `member_input_block_${new Date().getMilliseconds()}`,
        element: {
          type: 'multi_users_select',
          placeholder: {
            type: 'plain_text',
            text: 'Select users',
            emoji: true,
          },
          action_id: 'multi_users_select-action',
          initial_users: isInitModal && members.length > 0 ? members : [],
        },
        label: {
          type: 'plain_text',
          text: '멤버를 선택해 주세요',
          emoji: true,
        },
      },

      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: '모든 인원을 선택합니다.',
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '전체 선택',
            emoji: true,
          },
          value: 'click_me',
          action_id: 'insert_all_users',
        },
      },
      {
        type: 'input',
        block_id: 'number_input',
        element: {
          type: 'number_input',
          is_decimal_allowed: false,
          action_id: 'number_input-action',
          initial_value: '1',
        },
        label: {
          type: 'plain_text',
          text: '몇 명을 뽑을까요?',
          emoji: true,
        },
      },
    ],
  };
}
