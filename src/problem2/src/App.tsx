import { useState, useEffect } from "react";
import { Form, Card, Typography, Space } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import "./App.css";
import CustomFormItem from "./components/CustomFormItem";
import { CustomInputTypes } from "./types";
import { BORDER_COLOR, TEXT_COLOR_1 } from "./config";

const { Title, Text } = Typography;

interface Token {
  currency: string;
  price: number;
  logo: string;
}

function App() {
  // hooks
  const [form] = Form.useForm();

  const initialValues = {
    amount: 1,
  };

  // states
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState<number | null>(initialValues.amount);
  const [result, setResult] = useState<number | null>(null);
  const [loading] = useState(false);

  // variables
  const tokenOptions = tokens.map((token) => ({
    value: token.currency,
    label: token.currency,
    logo: token.logo,
  }));

  // side effects
  useEffect(() => {
    fetch("/prices.json")
      .then((res) => res.json())
      .then((data) => {
        setTokens(data);
        setFromToken(data[0]);
        setToToken(data[1]);
      })
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  useEffect(() => {
    if (amount === undefined || !fromToken || !toToken) return;

    const converted = ((amount || 0) * fromToken.price) / toToken.price;
    setResult(converted);

    // setLoading(true);
    // setTimeout(() => {
    //   const converted = (amount * fromToken.price) / toToken.price;
    //   setResult(converted);
    //   setLoading(false);
    // }, 1000);
    form.validateFields();
  }, [amount, fromToken, toToken]);

  // Change From token
  const handleFromTokenChange = (val: string | number | null) => {
    const selectedToken = tokens.find((t) => t.currency === val) || null;
    if (selectedToken) {
      setFromToken(selectedToken);
    }
  };

  // Change To token
  const handleToTokenChange = (val: string | number | null) => {
    const selectedToken = tokens.find((t) => t.currency === val) || null;
    if (selectedToken) {
      setToToken(selectedToken);
    }
  };

  // Change amount
  const handleAmountChange = (val: string | number | null) => {
    const numericVal = val
      ? typeof val === "string"
        ? parseFloat(val)
        : val
      : null;

    setAmount(numericVal);
  };

  // Swap token value
  const handleSwapToken = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  return (
    <Card
      style={{
        margin: "auto",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        borderRadius: 24,
      }}
      styles={{
        body: {
          padding: 32,
        },
      }}
    >
      <Space direction="vertical" size={24} style={{ marginBottom: 32 }}>
        <Title
          style={{
            fontSize: 40,
            fontWeight: "500",
            margin: 0,
          }}
        >
          {`${amount || 0} ${fromToken?.currency} to ${toToken?.currency}`}
        </Title>
        <Title style={{ fontSize: 24, margin: 0 }}>Currency Swap</Title>
      </Space>

      <Form form={form} layout="vertical" initialValues={initialValues}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CustomFormItem
            label="Amount to send"
            value={amount}
            onChange={handleAmountChange}
            type={CustomInputTypes.INPUT_NUMBER}
            isLoading={loading}
            formField={"amount"}
          />

          <div style={{ position: "relative", flex: 1 }}>
            <CustomFormItem
              label="From"
              value={fromToken?.currency}
              onChange={handleFromTokenChange}
              type={CustomInputTypes.SELECTION}
              options={tokenOptions}
              customStyle={{ paddingRight: 32 }}
              isLoading={loading}
            />
            <div
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                border: `1px solid ${BORDER_COLOR}`,
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: "50%",
                right: -24,
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={handleSwapToken}
            >
              <SwapOutlined style={{ fontSize: 24 }} />
            </div>
          </div>

          <CustomFormItem
            label="To"
            value={toToken?.currency}
            onChange={handleToTokenChange}
            type={CustomInputTypes.SELECTION}
            options={tokenOptions}
            customStyle={{ paddingLeft: 32 }}
            isLoading={loading}
          />
        </div>

        <Space
          direction="vertical"
          style={{ width: "100%", alignItems: "flex-start", marginTop: 24 }}
          size={0}
        >
          <Text
            style={{ color: TEXT_COLOR_1, fontSize: 16, fontWeight: "500" }}
          >
            {`${amount || 0} ${fromToken?.currency} =`}
          </Text>
          <Text style={{ fontSize: 30, fontWeight: "500" }}>
            {`${result?.toFixed(6) || 0} ${toToken?.currency}`}
          </Text>
          {amount && amount > 1 ? (
            <Text style={{ color: TEXT_COLOR_1, fontSize: 14 }}>
              {`1 ${fromToken?.currency} = ${
                result ? (result / amount)?.toFixed(6) : 0
              } ${toToken?.currency}`}
            </Text>
          ) : (
            <></>
          )}
          <Text style={{ color: TEXT_COLOR_1, fontSize: 14 }}>
            {`1 ${toToken?.currency} = ${(
              (1 / (fromToken?.price || 1)) *
              (toToken?.price || 1)
            ).toFixed(6)} ${fromToken?.currency}`}
          </Text>
        </Space>
      </Form>
    </Card>
  );
}

export default App;
