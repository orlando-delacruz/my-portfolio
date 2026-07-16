// ================================================================
// FILE: src/components/ui/Form/FaqForm/FaqForm.jsx
// ================================================================

import { memo, useState } from "react";
import { Form, message } from "antd";
import * as S from "./FaqForm.styled";

/**
 * FaqForm
 * Ask-a-question panel rendered beside the FAQ accordion.
 *
 * @param {string} imageSrc - The image URL to display at the top of the form
 */
const FaqForm = memo(({ imageSrc }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('/api/send-faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send');
      }

      message.success("Your question has been submitted! We'll get back to you soon.");
      form.resetFields();
    } catch (error) {
      console.error('Submit error:', error);
      message.error(error.message || 'Failed to send. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fallback image if none provided
  const defaultImage = "https://picsum.photos/seed/dental-clinic/638/271";

  // Build the image URL with cache-busting to force the browser to load the latest version
  const imageUrl = imageSrc || defaultImage;
  const cacheBustedUrl = imageUrl.includes("?")
    ? imageUrl + "&t=" + Date.now()
    : imageUrl + "?t=" + Date.now();

  return (
    <S.FormWrapper>
      <S.FormHeader>
        <S.FormTitle>Ask Any Questions</S.FormTitle>
        <S.FormSubtitle>Feel free to reach out to us with your inquiries</S.FormSubtitle>
      </S.FormHeader>

      <S.ClinicImage
        src={cacheBustedUrl}
        alt="Leidi Bud Dentals clinic interior"
        width={638}
        height={271}
        loading="lazy"
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label={<S.FieldLabel>Email</S.FieldLabel>}
          rules={[
            { required: true, message: "Please enter your email." },
            { type: "email", message: "Please enter a valid email address." },
          ]}
        >
          <S.StyledInput placeholder="your@email.com" size="large" />
        </Form.Item>

        <Form.Item
          name="question"
          label={<S.FieldLabel>Write a Question</S.FieldLabel>}
          rules={[
            { required: true, message: "Please write your question." },
            { min: 10, message: "Please provide a bit more detail (min 10 characters)." },
          ]}
        >
          <S.StyledTextArea
            placeholder="Write your question here..."
            rows={5}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item>
          <S.SubmitButton
            htmlType="submit"
            loading={loading}
            aria-label="Submit your question"
          >
            Submit Now
          </S.SubmitButton>
        </Form.Item>
      </Form>
    </S.FormWrapper>
  );
});

FaqForm.displayName = "FaqForm";
export default FaqForm;