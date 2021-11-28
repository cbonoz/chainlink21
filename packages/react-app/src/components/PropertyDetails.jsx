import React, { useState, useEffect } from "react";
import { Row, Col, Steps, Button, Image, Modal } from "antd";
import { DEFAULT_HOME_ICON, DEFAULT_DESCRIPTION, RINKEBY_CHAIN_ID } from "../constants";
import { capitalize, DEMO_PROPERTIES } from "../util";
import { getStreamForProperty } from "../util/ceramic";
import logo from "../assets/icon.png";
import { getTransactions } from "../util/covalent";

const { Step } = Steps;

const steps = [
  {
    title: "Purchase NFT here",
    content: "Purchasing the NFT gives you a stake in the listed property",
  },
  {
    title: "Your address is added to a list of participants",
    content: "After purchasing the NFT, your address is saved as a participant",
  },
  {
    title: "Get repaid",
    content: "Payout occurs when the property is next sold.",
  },
];

function PropertyDetails({ match, property, address }) {
  const pid = match && match.params.propertyId;
  const [p, setP] = useState(property || DEMO_PROPERTIES[0]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState();
  const [fullData, setFullData] = useState();
  // const [data, setData] = useState({})
  const propTitle = p.title || "property";
  const listingTitle = `participate in NFT sale for ${propTitle}`;

  const getProperty = async cid => {
    console.log("getProperty", cid);
    if (!cid) {
      return;
    }
    setLoading(true);

    try {
      const res = await getStreamForProperty(cid);
      setP(res);
      console.log();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (p) {
      getProperty(p.streamId || pid);
    }
  }, [pid]);

  const getHistory = async () => {
    setLoading(true);
    const { nftContract, nftUrl, owner } = p;
    if (!nftContract) {
      alert("No history available for contract");
      return;
    }

    try {
      const { data } = await getTransactions(owner || address || nftContract);
      setHistory(data.data);
    } catch (e) {
      console.error("error getting history", e);
    } finally {
      setLoading(false);
    }
  };

  const purchase = () => {
    const unl = window.unlockProtocol;
    if (!unl) {
      alert("Unlock protocol not defined on window");
      return;
    }

    // https://docs.unlock-protocol.com/developers/paywall/locking-page
    const config = {
      pessimistic: true,
      locks: {
        "0xA5c657Ce8f1f77283344985Ac00a5303f86b45e7": {
          // TODO: use dynamic lock id
          network: RINKEBY_CHAIN_ID, // rinkeby
          name: "Unlock",
        },
      },
      icon: DEFAULT_HOME_ICON,
      callToAction: {
        default: `To ${listingTitle}, complete payment by unlocking access below.`,
      },
      metadataInputs: [
        {
          name: "Your name",
          type: "text",
          required: true,
        },
      ],
    };
    unl.loadCheckoutModal(config);
  };

  const imgUrl = p.imgUrl || DEFAULT_HOME_ICON;

  return (
    <div>
      <img src={logo} className="header-icon" />
      <br />
      <h1>{capitalize(listingTitle)}.</h1>
      {/* <hr /> */}
      <br />
      <br />
      <Row>
        <Col span={8}>
          <h2>Property Details</h2>
          <Image src={imgUrl} width={200} />
          {/* <p>{JSON.stringify(p)}</p> */}

          <h2>{p.title}</h2>
          <h3>{p.description || DEFAULT_DESCRIPTION}</h3>
          <h3>Cost: {p.eth} Eth</h3>
          <hr />
          <a
            href=""
            className="pointer"
            onClick={e => {
              e.preventDefault();
              setFullData(p);
            }}
          >
            Full data
          </a>
          {/* <Listify obj={p} /> */}
        </Col>
        <Col span={4}></Col>
        <Col span={12}>
          <h2 className="float-left">Instructions</h2>
          <div className="instruction-area">
            <p></p>
            <Steps direction="vertical" current={0}>
              {steps.map(item => (
                <Step key={item.title} title={item.title} description={item.content} />
              ))}
            </Steps>
            <Button className="float-left" size="large" type="primary" onClick={purchase}>
              Purchase
            </Button>
            <Button className="float-left" size="large" type="secondary" onClick={getHistory}>
              Owner history
            </Button>
          </div>
        </Col>
      </Row>

      <Modal
        size="large"
        width={800}
        title={"Full data for " + p.title}
        onCancel={() => setFullData(undefined)}
        footer={null}
        visible={!!fullData}
      >
        <pre>{JSON.stringify(fullData || {}, null, "\t")}</pre>
        <p>
          <Button className="float-right" onClick={() => setFullData(undefined)}>
            Ok
          </Button>
        </p>
        <br />
        <br />
      </Modal>

      <Modal
        size="large"
        width={800}
        title={"View history"}
        onCancel={() => setHistory(undefined)}
        visible={!!history}
        footer={null}
      >
        <div className="history-area">
          <pre>{JSON.stringify(history || {}, null, "\t")}</pre>
        </div>
        <p>
          <Button className="float-right" onClick={() => setHistory(undefined)}>
            Ok
          </Button>
        </p>
        <br />
        <br />
      </Modal>
    </div>
  );
}

export default PropertyDetails;
