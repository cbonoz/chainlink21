import React from "react";

import { Steps, Divider, Button } from "antd";

import { APP_DESC } from "../constants";
import logo from "../assets/logo.png";

const { Step } = Steps;

function Home({ login, loggedIn, history }) {
  const onStart = loggedIn ? () => history.push("/list-property") : login;
  return (
    <div>
      <div className="logo-section">
        <img src={logo} className="home-logo" />
        <p>{APP_DESC}</p>
      </div>
      <Steps progressDot current={2}>
        <Step title="Connect your Ethereum wallet." />
        <Step title="Find, create, and sell NFT's around your owned real estate." />
        <Step title="Fundraise or create limited collectibles." />
      </Steps>

      <div className="home-button-section">
        <Button type="primary" size="large" onClick={onStart}>
          {loggedIn ? "Create listing" : "Get started"}
        </Button>
      </div>
    </div>
  );
}

export default Home;
