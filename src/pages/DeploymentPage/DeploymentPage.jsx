import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  CardBody, Row, Col, Spinner,
  Nav, NavLink, NavItem, TabContent, TabPane,
  Form, FormGroup, Label, Badge,
  DropdownToggle, DropdownMenu, DropdownItem  
} from 'reactstrap';
import { StandardTemplate } from 'templates';
import { connect } from 'react-redux';
import { fetchStart as permissionFetchStart} from 'reducers/permission';
import InputInstructions from './components/InputInstructions';
import { DragDropCodeViewer, CodeViewer } from 'components';
import {
  CardStyled, CardHeaderStyled, PageTitleDivStyled,
  InputStyled, ButtonPrimary, ToolTipUncontrolledStyled, ToolTipStyled,
  DropdownStyled, OverlayStyled, ButtonGroupSeperated
} from 'styled';
import cogoToast from 'cogo-toast';

import { defaultSet } from 'reducers/permission';
import { folderSet, abiImport, contractCompile, contractDeploy, logClear, outputClear } from './DeploymentPageReducer';

const ToolTipSVG = () => 
  <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">   
    <g id="Final-Version" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Artboard" transform="translate(-93.000000, -44.000000)">
          <g id="Group-15" transform="translate(93.000000, 44.000000)">
              <circle id="Oval" fill="#667D96" cx="9" cy="9" r="9"></circle>
              <text id="i" fontFamily="ProximaNova-Semibold, Proxima Nova" fontSize="14" fontWeight="500" fill="#FFFFFF">
                  <tspan x="7.313" y="14">i</tspan>
              </text>
          </g>
      </g>
    </g>
  </svg>

const ActionButton = styled(ButtonPrimary)`
  width: 156px;
`

const tabPane = {
  height: "200px",
  overflowY: "auto"
}

const outputPane = {
  height: "325px",
  padding: "1.5em",
  overflowY: "auto",
  backgroundColor: "#f8f9fa"
}

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

const LogCardStyled = styled(CardStyled)`
  border: none;
  margin-right: -1.3em;
  margin-left: -1em;
`

const LogCardHeaderStyled = styled(CardHeaderStyled)`
  border: none;
  background-color: #ffffff;
  padding: 5px 20px;
`

const ButtonPrimaryResponsive = styled(ButtonPrimary)`
  max-width: 130px;
  min-width: 71px;
  display: inline-block;
  width: 100%;
`
const LabelStyled = styled(Label)`
  display: inline;
  margin: auto;
`
const DivFlexStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 1.5em;
`
const NavLinkFullHeight = styled(NavLink)`
  height: 100%;
`

/**
 * Define constants to match the action state
 * The UI's useEffect relies on this state to determine what kind of toast to show
 * Fixes a problem where toast won't display if user deploys a contract after generating ABI
 */
const COMPILE_STATE = 1;
const DEPLOY_STATE = 2;

/**
 * Need to write a helper function to sanitize and clean the path
 * Sometimes the string looks the same but has isolates mixed into it
 * So we regenerate the string if it contains byte code equal or less than
 * the standard 128
 * 
 * @param {string} Filepath 
 */

const sanitizeFilepath = filepath => {
  let codeString = [];
  for (let i = 0; i < filepath.length; i++) {
    let code = filepath.charCodeAt(i);
    if (code <= 128) {
      codeString.push(code);
    }
  }
  return String.fromCharCode(...codeString);
}

const DeploymentPage = (props) => {

  let { permission: { data }, deployContainer, isProcessing, nodeos,
    folderSet, abiImport, contractCompile, contractDeploy, logClear,
    outputClear
  } = props;
  let { path, stdoutLog, stderrLog,
    abiPath, abiContents, compiled,
    errors, output, imported, deployed,
    compilerState
  } = deployContainer;
  let { list, defaultId } = data;

  const [clickDeploy, setClickDeploy] = useState(false);
  const [isOpenDropDown, toggleDropDown] = useState(false);
  const [currentFile, setCurrentFile] = useState("");
  const [activeTab, setActiveTab] = useState("1");
  const [currentId, setCurrentId] = useState(defaultId || null);
  const [compileTooltip, toggleCompileTooltip] = useState(false);
  const [deployTooltip, toggleDeployTooltip] = useState(false);

  const importRef = React.createRef();

  let selectedPermission = list.find(permission => currentId === permission.account+"@"+permission.permission && !!permission.private_key) || {};
  let noOfPermissions = list.slice(0).reduce((accounts, el) => {
    if (el.private_key) accounts++;
    return accounts;
  }, 0);

  useEffect(() => {
    props.permissionFetchStart();
    outputClear();
  }, [])

  useEffect(() => {
    if (!deployed && !clickDeploy && compilerState === COMPILE_STATE) {
      if (compiled && currentFile.length > 0) {
        cogoToast.success(
          "Smart contract successfully generated",
          { heading: 'Compile Success', position: 'bottom-center', hideAfter: 3 }
        );
      } else if (imported && currentFile.length > 0) {
        cogoToast.success(
          "Smart contract successfully imported",
          { heading: 'Import Success', position: 'bottom-center', hideAfter: 3 }
        );
      } else if (!compiled && currentFile.length > 0) {
        cogoToast.error(
          "Smart contract failed to compile, please check ABI / Deployment Log",
          { heading: 'Compile Unsuccessful', position: 'bottom-center', hideAfter: 3 }
        );
      }
    } else if (!deployed && clickDeploy && compilerState === DEPLOY_STATE) {
      cogoToast.error(
        "Smart contract could not be deployed, please check ABI / Deployment Log",
        { heading: 'Deployment Unsuccessful', position: 'bottom-center', hideAfter: 3 }
      );
      setClickDeploy(false);
    } else if (deployed && clickDeploy && compilerState === DEPLOY_STATE) {
      cogoToast.success(
        "Smart contract successfully deployed",
        { heading: 'Deployment Success', position: 'bottom-center', hideAfter: 3 }
      );
      setClickDeploy(false);
    }
  }, [compilerState]);

  function handleChange(ev) {
    ev.preventDefault();
    folderSet(ev.target.value.trim());
  };

  function generateAbi(ev) {
    ev.preventDefault();
    let cleanPath = sanitizeFilepath(path);
    let actualRootPath = (cleanPath.endsWith("/")) ? cleanPath : cleanPath + "/";
    let fullPath = {
      source: actualRootPath + currentFile
    }
    logClear();
    contractCompile(fullPath);
  }

  function deployContract(ev) {
    ev.preventDefault();
    let cleanPath = sanitizeFilepath(path);
    let actualRootPath = (cleanPath.endsWith("/")) ? cleanPath.toString() : cleanPath.toString() + "/";
    let currentPermission = list.find(account => account.account+"@"+account.permission === currentId);
    let msg = `无法在系统协议所有者下部署协议`;
    let fullPath = {
      source: actualRootPath + currentFile
    }
    let deployer = {
      endpoint: nodeos,
      account_name: currentPermission["account"],
      private_key: currentPermission["private_key"],
      permission: currentPermission["permission"],
      abiSource: (imported) ? abiPath : null
    }
    logClear();
    setClickDeploy(true);

    if (currentPermission["account"] !== 'eosio')
      contractDeploy(fullPath, deployer);
    else {
      cogoToast.warn(msg, {
        heading: '无法部署',
        position: 'bottom-center',
        hideAfter: 4
      });
      setClickDeploy(false);
    }
  }

  function clickButton() {
    importRef.current.click();
  }

  function handleFileSelect(ev) {
    ev.preventDefault();
    const file = ev.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      let contents = e.target.result;
      let fileContents = {
        abiName: file.name,
        content: contents
      };
      abiImport(fileContents);
    }

    reader.readAsText(file);
    ev.target.value = null;
  }

  return (
    <StandardTemplate>
      <OverlayStyled isLoading={isProcessing}></OverlayStyled>
      {
        isProcessing &&
        <div style={{ position: "fixed", top: "50%", left: "50%", zIndex: "1000" }}>
          <Spinner color="primary"
            style={{
              width: "5rem",
              height: "5rem"
            }}
          />
        </div>
      }
      <div className="DeploymentPage ">
        <Row>
          <Col xs="12">
            <PageTitleDivStyled>部署协议页面</PageTitleDivStyled>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <FirstCardStyled>
              <CardHeaderStyled>
                第 1 步 - 选择文件入口点
                </CardHeaderStyled>
              <CardBody>
                <Row>
                  <Col xs="6" sm="6" md="6" lg="6" xl="5">
                    <InputInstructions />
                  </Col>
                  <Col xs="6" sm="6" md="6" lg="6" xl="7">
                    <DragDropCodeViewer
                      readOnly={true}
                      setCurrentFile={setCurrentFile}
                    /> 
                    <DivFlexStyled>
                      <LabelStyled> Root&nbsp;Folder&nbsp;Path: </LabelStyled>&nbsp;&nbsp;
                      <LabelStyled id="rootFolder"><ToolTipSVG /></LabelStyled>&nbsp;&nbsp;
                      <InputStyled type="text"
                            name="rootFolder"                            
                            value={path}
                            onChange={(ev) => handleChange(ev)} />
                    </DivFlexStyled>
                    <ToolTipUncontrolledStyled placement="right" target="rootFolder"
                      delay={{ show: 0, hide: 0}}
                      trigger="hover focus"
                      autohide={true}
                    >
                      在此字段中输入包含 .cpp 文件的绝对文件夹路径。
                      <br/>例如:<br/> /Users/syzygy/contracts/mycontract
                      </ToolTipUncontrolledStyled>
                  </Col>
                </Row>
              </CardBody>
            </FirstCardStyled>
          </Col>
        </Row>
        <Row>
          <Col xs="6" sm="6" md="6" lg="6" xl="5">
            <CardStyled style={{marginRight: '-0.5em'}}>
              <CardHeaderStyled>
                第 2 步 - ABI 文件（可选）
              </CardHeaderStyled>
              <CardBody className="clearfix">
                <Row>
                  <Col sm={12}>
                    <CodeViewer
                      language="json"
                      readOnly={true}
                      value={abiContents}
                      height="350"
                    />
                  </Col>
                </Row> <br />
                <Form>
                  <FormGroup row >
                    <Col sm={12}>
                      <ButtonGroupSeperated className="float-right">
                        <ActionButton
                          id="GenerateAbi"
                          onClick={(ev) => generateAbi(ev)}
                          disabled={path.length === 0 || currentFile.length === 0 || isProcessing}
                        >
                          生成 ABI
                        </ActionButton>
                        <ActionButton
                          id="ImportAbi"
                          onClick={() => { clickButton() }}
                          disabled={isProcessing}
                        >
                          导入 ABI
                        </ActionButton>
                      </ButtonGroupSeperated>
                      <input type="file"
                        id="abiImporter"
                        accept=".abi"
                        ref={importRef}
                        style={{ display: "none" }}
                        onChange={(ev) => handleFileSelect(ev)}
                      />
                    </Col>
                  </FormGroup>
                </Form>
                <ToolTipStyled placement="top" target="GenerateAbi"
                  isOpen={compileTooltip}
                  toggle={()=>toggleCompileTooltip(!compileTooltip)}
                  delay={{ show: 0, hide: 0 }}
                  autohide={true}
                >
				  单击此按钮编译Smart协议并查看生成的 ABI
				  文件在下面的查看器中。
                </ToolTipStyled>
                <ToolTipUncontrolledStyled placement="top" target="ImportAbi"
                  delay={{ show: 0, hide: 0 }}
                  trigger="hover"
                  autohide={true}
                >
                  单击此按钮导入预制的 ABI 文件并在上面的查看器中查看它
                </ToolTipUncontrolledStyled>
              </CardBody>
            </CardStyled>
            <CardStyled style={{marginRight: '-0.5em'}}>
              <CardHeaderStyled>
                第 3 步 - 部署 {imported && <Badge color="primary" pill>Imported ABI</Badge>}
              </CardHeaderStyled>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label for="permissionSelect" style={{margin: 'auto 0', fontSize: '13px'}} xs="4" sm="4">
                      经以下许可:
                    </Label>
                    <Col xs="4" sm="6">
                      <DropdownStyled
                        isOpen={isOpenDropDown} 
                        toggle={() => { toggleDropDown(!isOpenDropDown) }}
                        style={{width: "100%"}}>
                        <DropdownToggle style={{width: "100%"}} caret={noOfPermissions > 0}>
                          {
                            noOfPermissions > 0
                              ? Object.keys(selectedPermission).length > 0
                                ? list.map(permission => {
                                  let msg = (currentId === defaultId) ?
                                    `${permission.account}@${permission.permission} (default)` :
                                    `${permission.account}@${permission.permission}`;
                                  if (currentId === permission.account+"@"+permission.permission)
                                    return msg;
                                  else
                                    return null;
                                })
                                : "选择权限"
                              : "没有可用权限"
                          }
                        </DropdownToggle>
                        {
                          noOfPermissions > 0
                            ? <DropdownMenu style={{width: "100%"}} right>
                              {
                                list.map((permission) => permission.private_key &&
                                  <DropdownItem key={permission.account+"@"+permission.permission} onClick={() => { setCurrentId(permission.account+"@"+permission.permission) }}>
                                    { (permission.account+"@"+permission.permission === defaultId) ? permission.account+"@"+permission.permission+" (default)" : permission.account+"@"+permission.permission}
                                  </DropdownItem>)
                              }
                            </DropdownMenu>
                            : null
                        }
                      </DropdownStyled>
                    </Col>
                    <Col xs="4" sm="2">
                      <ButtonPrimaryResponsive
                        id="DeployContract"
                        className="btn float-right"
                        disabled={path.length === 0 ||
                          currentFile.length === 0 ||
                          isProcessing}
                        onClick={(ev) => deployContract(ev)}
                      >
                        部署
                      </ButtonPrimaryResponsive>
                    </Col>
                  </FormGroup>
                </Form>
                <ToolTipStyled placement="top" target="DeployContract"
                  isOpen={deployTooltip}
                  toggle={()=>toggleDeployTooltip(!deployTooltip)}
                  delay={{ show: 0, hide: 0 }}
                  autohide={true}
                >
				  立即编译并部署Smart协议。
                </ToolTipStyled>
              </CardBody>
            </CardStyled>
          </Col>
          <Col xs="6" sm="6" md="6" lg="6" xl="7">
            <LogCardStyled>
              <LogCardHeaderStyled className="clearfix">
                <span style={{ fontSize: "14px" }}>
                  ABI / 部署日志
                </span>
                <ActionButton
                  className="float-right"
                  id="ClearLogs"
                  onClick={() => {
                    if (errors.length > 0 || stderrLog.length > 0 || stdoutLog.length > 0)
                      cogoToast.info("Cleared all logs", { position: 'bottom-center', hideAfter: 2 });
                    logClear();
                  }}
                >
                  清除所有日志
                </ActionButton>
                <ToolTipUncontrolledStyled placement="top" target="ClearLogs"
                  delay={{ show: 0, hide: 0 }}
                  trigger="hover"
                  autohide={true}
                >
                  单击此按钮可删除当前显示的所有警告和错误日志
                </ToolTipUncontrolledStyled>
              </LogCardHeaderStyled>
              <CardBody>
                <div>
                  <Nav tabs justified>
                    <NavItem>
                      <NavLinkFullHeight
                        className={activeTab === "1" ? 'active' : ''}
                        onClick={() => setActiveTab("1")}
                      >
                        警告 {stdoutLog && stdoutLog.length > 0 ? "⚠️" : null}
                      </NavLinkFullHeight>
                    </NavItem>
                    <NavItem>
                      <NavLinkFullHeight
                        className={activeTab === "2" ? 'active' : ''}
                        onClick={() => setActiveTab("2")}
                      >
                        编译器错误 {stderrLog && stderrLog.length > 0 ? "⚠️" : null}
                      </NavLinkFullHeight>
                    </NavItem>
                    <NavItem>
                      <NavLinkFullHeight
                        className={activeTab === "3" ? 'active' : ''}
                        onClick={() => setActiveTab("3")}
                      >
                        服务器错误 {errors && errors.length > 0 ? "⚠️" : null}
                      </NavLinkFullHeight>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1" style={tabPane}>
                      <Row>
                        <Col sm={12}>
                          {
                            stdoutLog && stdoutLog.length === 0
                              ? <pre>暂无日志</pre>
                              : stdoutLog.map((line, i) =>
                                <pre key={"stdout_" + i}>
                                  {line}
                                </pre>)
                          }
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2" style={tabPane}>
                      <Row>
                        <Col sm={12}>
                          {
                            stderrLog && stderrLog.length === 0
                              ? <pre>暂无日志</pre>
                              : stderrLog.map((line, i) =>
                                <pre key={"stderr_" + i}>
                                  {line}
                                </pre>)
                          }
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="3" style={tabPane}>
                      <Row>
                        <Col sm={12}>
                          {
                            errors && errors.length === 0
                              ? <pre>暂无日志</pre>
                              : errors.map((line, i) =>
                                <div key={"errors_" + i}>
                                  <code>{line}</code>
                                </div>)
                          }
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </div>
              </CardBody>
              <CardBody>
              <div style={outputPane}>
                <p style={{ fontSize: "14px" }}><b>部署结果</b></p>
                <br />
                {
                  !deployed
                    ? null
                    : output
                      ? <div>
                        <h5>成功部署 {currentFile.split('.')[0]} Smart协议:</h5>
                        <pre>{JSON.stringify(output, null, 4)}</pre>
                      </div>
                      : <div>
                        <h5>出现问题，请查看日志以了解可能的错误和原因</h5>
                      </div>
                }
              </div>
              </CardBody>
            </LogCardStyled>
          </Col>
        </Row>
      </div>
    </StandardTemplate>
  )
}

export default connect(
  ({ permission, deploymentPage: { deployContainer, isProcessing }, endpoint: { path: { nodeos } } }) => ({
    permission, deployContainer, isProcessing, nodeos
  }),
  {
    defaultSet,
    folderSet,
    abiImport,
    contractCompile,
    contractDeploy,
    logClear,
    outputClear,
    permissionFetchStart
  }

)(DeploymentPage);
