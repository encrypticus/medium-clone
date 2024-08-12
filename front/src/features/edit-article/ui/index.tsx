'use client';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { FormProps, SelectProps } from 'antd';
import { Button, Form, Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import type { CreateArticleDto } from '@/src/entities/article';

import { useMessage } from '@/src/shared/ui/message';
import type {
  EditArticleProps,
  FormItemBody,
  FormItemDescription,
  FormItemTitle,
} from '../types';
import { UiTitle } from '@/src/shared/ui/title/UiTitle';
import { TagListSelect } from '@/src/entities/tags';
import { useEditArticle } from '../model/use-edit-article';

const { Item } = Form;

export const EditArticleForm: FC<EditArticleProps> = ({ tagList, article }) => {
  const { mutateAsync, isPending } = useEditArticle(article.slug);

  const [options] = useState<SelectProps['options']>(
    tagList.map((tag) => ({ label: tag, value: tag })),
  );
  const [form] = Form.useForm<CreateArticleDto>();
  const { showMessage: articleMessage } = useMessage({
    content: 'The article has been successfully published!',
    type: 'success',
  });

  const onSubmit: FormProps<CreateArticleDto>['onFinish'] = (values) => {
    mutateAsync(values).then((data) => {
      if (data) {
        handleArticlePublished();
      }
    });
  };

  const handleArticlePublished = () => {
    articleMessage();
  };

  useEffect(() => {
    form.setFieldsValue({
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList,
    });
  }, [article]);

  return (
    <div className={'form-wrapper'}>
      <UiTitle text={'Edit article'} />
      <Form form={form} className={'form'} onFinish={onSubmit}>
        <Item<FormItemTitle>
          rules={[{ required: true, message: 'Please input title!' }]}
          className={'inputs'}
          name={'title'}
        >
          <Input size={'large'} placeholder={'Article title'} allowClear />
        </Item>

        <Item<FormItemDescription>
          rules={[{ required: true, message: 'Please input description!' }]}
          className={'inputs'}
          name={'description'}
        >
          <Input
            size={'large'}
            placeholder={"What's this article about?"}
            allowClear
          />
        </Item>

        <Item<FormItemBody>
          required
          rules={[{ required: true, message: 'Please input body!' }]}
          className={'inputs'}
          name={'body'}
        >
          <Input.TextArea
            rows={10}
            size={'large'}
            placeholder={'Write your article'}
            allowClear
          />
        </Item>

        <TagListSelect options={options} />

        <FormItem>
          <Button loading={isPending} htmlType={'submit'}>
            Publish article
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};
