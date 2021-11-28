import React from "react";

import { Steps, Divider, Button } from "antd";

import { APP_DESC } from "../constants";
import logo from "../assets/logo.png";

const { Step } = Steps;

function Home({ login, loggedIn }) {
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

      {!loggedIn && (
        <div className="home-button-section">
          <Button type="primary" size="large" onClick={login}>
            Get started
          </Button>
        </div>
      )}
    </div>
  );
}

export default Home;
