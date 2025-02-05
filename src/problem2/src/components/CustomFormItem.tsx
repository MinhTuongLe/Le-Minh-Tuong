/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import { Form, InputNumber, Select, Typography } from "antd";
import { CustomInputTypes } from "../types";
import { LoadingOutlined } from "@ant-design/icons";
import { BACKGROUND_COLOR, BORDER_COLOR, TEXT_COLOR_2 } from "../config";

const { Option } = Select;

interface CustomFormItemProps {
  label: string;
  value?: number | string | null;
  onChange: (value: string | number | null) => void;
  type: CustomInputTypes;
  options?: { value: string; label: string; logo?: string }[];
  customStyle?: any;
  isLoading?: boolean;
  formField?: string;
}

const CustomFormItem: React.FC<CustomFormItemProps> = ({
  label,
  value,
  onChange,
  type,
  options = [],
  customStyle,
  isLoading,
  formField,
}) => {
  // hooks
  const inputRef = useRef<any>(null);

  // focus handler
  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      onClick={handleFocus}
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 8,
        border: `1px solid ${BORDER_COLOR}`,
        backgroundColor: BACKGROUND_COLOR,
        flex: 1,
        minWidth: 250,
        cursor: "text",
        ...customStyle,
      }}
    >
      <Typography.Text
        style={{
          textAlign: "left",
          fontSize: 14,
          color: TEXT_COLOR_2,
        }}
      >
        {label}
      </Typography.Text>
      <Form.Item
        style={{ marginBottom: 0, width: "100%" }}
        rules={
          type === CustomInputTypes.INPUT_NUMBER
            ? [
                {
                  required: true,
                  message: "Please enter a valid number",
                },
              ]
            : []
        }
        name={formField}
      >
        {type === CustomInputTypes.INPUT_NUMBER ? (
          <InputNumber
            ref={inputRef}
            min={0}
            value={value}
            onChange={onChange}
            style={{
              width: "100%",
              border: "none",
              fontSize: 24,
            }}
            suffix={
              isLoading ? <LoadingOutlined style={{ fontSize: 12 }} /> : <></>
            }
            disabled={isLoading}
          />
        ) : (
          <Select
            ref={inputRef}
            showSearch
            allowClear
            value={value}
            onChange={onChange}
            placeholder="Type to search..."
            optionFilterProp="children"
            style={{ width: "100%", height: 37.71 }}
            dropdownRender={(menu) => (
              <div style={{ background: "white" }}>{menu}</div>
            )}
            disabled={isLoading}
            loading={isLoading}
          >
            {options.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {opt.logo && (
                    <img
                      src={opt.logo}
                      alt={opt.value}
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                  )}
                  <Typography.Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    {opt.label}
                  </Typography.Text>
                </div>
              </Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </div>
  );
};

export default CustomFormItem;
