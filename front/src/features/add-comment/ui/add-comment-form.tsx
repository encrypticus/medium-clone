'use client';
import type { FormProps } from 'antd';
import { Button, Flex, Form, Input } from 'antd';
import { useAddComment } from '@/src/features/add-comment/model/use-add-comment';
import type { FC } from 'react';
import { useMessage } from '@/src/shared/ui/message';

interface AddCommentFormProps {
  articleId?: number;
}

export const AddCommentForm: FC<AddCommentFormProps> = ({ articleId }) => {
  const [form] = Form.useForm<{ comment: string }>();

  const { showMessage } = useMessage({
    content: 'The comment was successfully added!',
    type: 'success',
  });

  const onSubmit: FormProps<{ comment: string }>['onFinish'] = async (
    values,
  ) => {
    const data = await mutateAsync({
      text: values.comment,
      articleId: articleId ?? 0,
    });
    if (data) {
      form.resetFields();
      showMessage();
    }
  };

  const { isPending, mutateAsync } = useAddComment();

  return (
    <Form form={form} onFinish={onSubmit}>
      <Form.Item
        name={'comment'}
        rules={[{ required: true, message: 'Please input comment!' }]}
      >
        <Input.TextArea rows={7} size={'large'} allowClear />
      </Form.Item>

      <Form.Item>
        <Flex justify={'flex-end'}>
          <Button loading={isPending} htmlType={'submit'}>
            Post Comment
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};
