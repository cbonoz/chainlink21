import React, { useState, useEffect, useRef } from "react";

import { Input, Button, Steps, Layout, Modal, Checkbox } from "antd";
// import { createBucketWithFiles } from "../../util/bucket";
// import { toGatewayURL } from "nft.storage";
import { addCard, createFullAddress, DEMO_PROPERTIES, ipfsUrl } from "../util";
import { FileDropzone } from "./FileDropzone";
import ReactSignatureCanvas from "react-signature-canvas";
import IntegerStep from "./IntegerStep";
import { makeListingFiles, storeFiles } from "../util/stor";
import { createStream, initCeramic } from "../util/ceramic";
import { DEFAULT_HOME_ICON } from "../constants";
import { createNftFromFileData } from "../util/nftport";
import { Listify } from "../util/listify";
import { saveProperty } from "../util/moral";
import { deployContract } from "../util/homechain";

const { Header, Footer, Sider, Content } = Layout;

const { Step } = Steps;

const LAST_STEP = 3;

const testAddress = createFullAddress();

const UPLOAD_FILES = false;

function ListProperty({ isLoggedIn, signer, provider, address, blockExplorer }) {
  const [currentStep, setCurrentStep] = useState(0);
  const sigRef = useRef();

  useEffect(() => {
    console.log("isLoggedIn", isLoggedIn);
    if (isLoggedIn && currentStep === 0) {
      updateStep(1);
    } else if (!isLoggedIn && currentStep !== 0) {
      setCurrentStep(0);
    }
  }, [isLoggedIn]);

  const [files, setFiles] = useState([]);
  const [info, setInfo] = useState({
    title: testAddress.split(",")[0],
    description: `${testAddress}. Own 1% of this property`,
    percent: 10,
    limit: 10,
    eth: 1.0, // effective default is 1 eth for 1% ~4k, ~400k net valuation.
    owner: address,
    collectibleOnly: true,
    imgUrl: "",
  });
  const [result, setResult] = useState({});
  const [signatureCollected, setSignatureCollected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const clearInfo = () => setInfo({});

  const updateInfo = update => {
    console.log("update", update);
    setInfo({ ...info, ...update });
  };

  const handleOk = () => {
    setSignatureCollected(true);
  };

  useEffect(() => {
    if (signatureCollected) {
      updateStep(1);
    }
  }, [signatureCollected]);

  const updateStep = async offset => {
    const newStep = currentStep + offset;
    if (newStep === LAST_STEP) {
      if (UPLOAD_FILES && (!files || files.length === 0)) {
        alert("At least one file must be added");
        return;
      }

      if (!signatureCollected) {
        setShowModal(true);
        return;
      }

      setLoading(true);

      let d = { ...info };

      if (UPLOAD_FILES) {
        try {
          const { data: nftData } = await createNftFromFileData(
            info.title,
            info.description,
            files[0],
            address,
            "rinkeby",
          );
        } catch (e) {
          console.error("error creating listing", e);
          alert("Error creating listing: " + e.toString());
          return;
        }

        d = {
          ...d,
          nftUrl: nftData.transaction_external_url,
          nftContract: nftData.contract_address,
        };

        try {
          await initCeramic(address);
        } catch (e) {
          console.error(e);
        }

        const streamId = await createStream(d);

        const sigData = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
        const uploadFiles = makeListingFiles(files, sigData, { streamId });
        const cid = await storeFiles(uploadFiles);

        d = {
          ...d,
          cid,
          streamId,
          ipfsUrl: ipfsUrl(cid),
          imgUrl: info.imgUrl || DEFAULT_HOME_ICON,
          createdAt: new Date(),
        };
      }

      try {
        if (!d.collectibleOnly) {
          // Deploy as interactable smart contract.
          try {
            const contract = await deployContract(d);
          } catch (e) {
            console.error("error deploying contract", e);
          }
        }
        // Save property after contract deploy (if applicable).
        await saveProperty(d);
        d["contract"] = contract;
      } catch (e) {
        console.error("error saving property", e);
        return;
      } finally {
        setLoading(false);
      }

      addCard(d); // TODO: add persistence (ex: moralis).
      setResult(d);
      setShowModal(false);
    }

    console.log("update step", newStep);
    setCurrentStep(newStep);
  };

  const getBody = () => {
    switch (currentStep) {
      case 0: // confirm login
        return (
          <div>
            <h2 className="sell-header">Login</h2>
            <p>
              In order to create a listing, you must login with your metamask or wallet account. Click 'connect' in the
              top right to begin.
            </p>
          </div>
        );
      case 1: // info
        return (
          <div className="info-section">
            <h2 className="sell-header">What are you listing?</h2>
            <Input
              addonBefore={"Property(s)"}
              placeholder="Enter name of listing"
              value={info.title}
              onChange={e => updateInfo({ title: e.target.value })}
            />
            <Input
              addonBefore={"Description"}
              placeholder="Enter listing description"
              value={info.description}
              onChange={e => updateInfo({ description: e.target.value })}
            />

            <Input
              addonBefore={"Image"}
              addonAfter={"A default will be used if blank"}
              placeholder="Enter listing image or thumbnail url (optional)"
              value={info.imgUrl}
              onChange={e => updateInfo({ imgUrl: e.target.value })}
            />

            <Input addonBefore={"Address"} disabled placeholder="Payment Address: " value={address} />
            <div className="percent-form">
              <Checkbox
                checked={info.collectibleOnly}
                onChange={e => updateInfo({ collectibleOnly: e.target.checked })}
              >
                Collectible only
              </Checkbox>

              {!info.collectibleOnly && (
                <div>
                  <br />
                  <p className="float-left clear">
                    Enter percent of property (up to 10%) for sale: <br />
                    <br />
                    <IntegerStep val={info.percent} onChange={percent => updateInfo({ percent })} />
                  </p>

                  <Input
                    addonBefore={"Number purchase-able"}
                    placeholder="Enter max possible participants"
                    value={info.limit}
                    type="number"
                    onChange={e => updateInfo({ limit: e.target.value })}
                  />

                  <Input
                    addonBefore={"Enter price (Eth)"}
                    placeholder="Enter eth price per participant"
                    value={info.eth}
                    suffix={"ETH"}
                    onChange={e => updateInfo({ eth: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 2: // upload
        return (
          <div>
            <FileDropzone files={files} setFiles={setFiles} />
          </div>
        );
      case 3: // done
        return (
          <div className="complete-section">
            <h2 className="sell-header">Complete!</h2>
            <Listify obj={result} />
            <h3>Listing information</h3>

            {result.ipfsUrl && (
              <a href={result.ipfsUrl} target="_blank">
                Click here to view assets.
              </a>
            )}
            <br />
            {result.nftUrl && (
              <a href={result.nftUrl} target="_blank">
                Click here to view created NFT.
              </a>
            )}
          </div>
        );
    }
  };

  return (
    <div className="content">
      <h1>Create real estate NFT listing</h1>
      <Header>
        <Steps current={currentStep}>
          <Step title="Login" description="Authenticate." />
          <Step title="Information" description="What are you listing?" />
          <Step title="Verify" description="Add proof of ownership or deed." />
          <Step title="Done" description="Listing is live." />
        </Steps>
      </Header>
      <Content>
        <div className="sell-area">{getBody()}</div>
      </Content>
      <Footer>
        {currentStep > 0 && currentStep !== LAST_STEP && !isLoggedIn && (
          <Button disabled={loading} type="primary" onClick={() => updateStep(-1)}>
            Previous
          </Button>
        )}
        {currentStep < LAST_STEP && (
          <Button disabled={loading} loading={loading} type="primary" onClick={() => updateStep(1)}>
            {currentStep === LAST_STEP - 1 ? "Done" : "Next"}
          </Button>
        )}

        {/* https://github.com/agilgur5/react-signature-canvas */}
        <Modal
          width={600}
          height={400}
          confirmLoading={loading}
          title="Enter signature"
          footer={null}
          visible={showModal}
          cancelText={"Cancel"}
          onCancel={() => setShowModal(false)}
        >
          {/* <h3>Enter signature</h3> */}
          <p>
            By signing this you are asserting that the attached document is valid and that you are the authorized party
            to create this transaction / non-fungible token.
          </p>
          <div className="sig-canvas">
            <ReactSignatureCanvas
              canvasProps={{ width: 475, height: 200, className: "sigCanvas" }}
              ref={ref => {
                sigRef.current = ref;
              }}
            />
            <p>Clicking 'Done' below will create and list the NFT for purchase.</p>
          </div>
          <div>
            <Button disabled={loading} onClick={() => sigRef.current.clear()}>
              Clear
            </Button>
            <Button disabled={loading} loading={loading} onClick={handleOk}>
              Confirm Listing
            </Button>
          </div>
        </Modal>
      </Footer>
    </div>
  );
}

export default ListProperty;
