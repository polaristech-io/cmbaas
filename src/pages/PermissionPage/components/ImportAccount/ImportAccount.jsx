import React, { useEffect } from 'react';
import {
  Form, FormGroup, Label, FormFeedback,
  Col, UncontrolledAlert, CardBody, Spinner
} from 'reactstrap';
import cogoToast from 'cogo-toast';

import { connect } from 'react-redux';

import { accountAdd, accountEdit } from 'reducers/permission';
import { panelSelect } from 'pages/PermissionPage/PermissionPageReducer';
import importValidate from './ImportAccountValidatorEngine/ImportAccountValidatorEngine';
import editValidate from './EditAccountValidatorEngine/EditAccountValidatorEngine';
import useForm from 'helpers/useForm';
import { CardStyled, CardHeaderStyled, ButtonPrimary, ButtonSecondary, InputStyled, 
  OverlayStyled, InfoDivStyled, ButtonGroupSeperated } from 'styled';
import styled from 'styled-components';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

const ImportAccount = (props) => {

  let {
    permission: {
      data: {
        keysData = [],
        importSuccess,
        isSubmitting,
        creationSuccess,
        submitError,
        list
      }
    },
    panel,
    accountAdd,
    accountEdit,
    panelSelect
  } = props;

  const { values, handleChange, handleSubmit, updateValues, errors } = (panel === 'import-account-importer')
    ? useForm(importAccount, importValidate) : useForm(editAccountKeys, editValidate);

  function importAccount() {
    if (keysData) {
      let keyAlreadyExists = keysData[0].private_key === values.privateKey && keysData[0].public_key === values.publicKey;

      if (keyAlreadyExists) {
        cogoToast.info("该密钥已导入，取消该操作", {
          heading: '密钥已导入',
          position: 'bottom-center',
          hideAfter: 2
        });
      } else {
        accountAdd({
          accountName: (keysData) ? keysData[0].account : "Unknown",
          privateKey: values.privateKey,
          permission: keysData[0].permission
        });
      }
    }
    window.scrollTo(0, 0);
  }

  function editAccountKeys() {
    let accountObj = list.filter(acct => acct["account"] === keysData[0].account);
    let ownerObj = accountObj.filter(eachPermission => eachPermission.permission === "owner")[0] || {"private_key": ""};

    let accountData = {
      accountName: (keysData) ? keysData[0].account : "Unknown",
      accountOwnerPrivateKey: ownerObj.private_key,
      permission: keysData[0].permission
    };

    if (keysData) {
      let keyNotChanged = keysData[0].private_key === values.privateKey && keysData[0].public_key === values.publicKey;

      if (keyNotChanged) {
        cogoToast.info("Your keys did not change, canceling the action", {
          heading: 'Keys Did Not Change',
          position: 'bottom-center',
          hideAfter: 2
        });
      } else {
        accountData["publicKey"] = values.publicKey;
        accountData["privateKey"] = values.privateKey;
        accountEdit(accountData);

      }
    }
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    const vals = (keysData) ? [
      { name: "privateKey", value: keysData[0].private_key },      
      { name: "publicKey", value: keysData[0].public_key }
    ] : [
        { name: "privateKey", value: "No private key" },
        { name: "publicKey", value: "No public key" }
      ]
    updateValues(vals);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="ImportAccount">
      <div>
        <>
          <FirstCardStyled>
            <OverlayStyled isLoading={isSubmitting}></OverlayStyled>
            {
              isSubmitting &&
                <div style={{position:"fixed",top:"50%",left:"50%", zIndex:"1000"}}>
                  <Spinner color="primary"
                      style={{
                          width: "5rem",
                          height: "5rem"
                      }}
                  />
                </div>
            }
            <CardHeaderStyled>
              {
                panel === 'import-account-edit' ? "Edit Account Details" : "Import Account Keys"
              }
            </CardHeaderStyled>
            <CardBody>
              {
                creationSuccess &&
                <UncontrolledAlert color="success">
                  {keysData[0].account || "未知账户"} 的密钥已成功更新
                </UncontrolledAlert>
              }
              {
                ((!creationSuccess) && submitError) ?
                  <UncontrolledAlert color="danger"> 
                    更新账户密钥时出错: {submitError}
                  </UncontrolledAlert>
                : null
              }
              {
                importSuccess &&
                <UncontrolledAlert color="success">
                  {keysData[0].account || "未知账户"} 的私钥已成功导入
                </UncontrolledAlert>
              }
              <InfoDivStyled>
                <p className="infoHeader">
                  { panel === 'import-account-importer' ? "Before you import your private keys..." : "Before you update your keys..."}
                </p>
                <p>
                  确保您使用的私钥符合 <code>base58 WIF</code> 兼容。 <b>WIF</b>代表“钱包导入格式”，是复制和粘贴私钥的便捷规范。
				  如果提交后您的任何密钥无效，该表格将通知您。 
				  另请确保您导入的私钥与此处列出的公钥<b>正确匹配</b>。否则，您将无法使用此帐户授权任何操作，因为区块链将没有声明授权的正确签名。
                </p>
                {
                  panel === 'import-account-edit' ? (<p>
                    如果您计划更新公钥，请确保新公钥采用有效的 <code>EOSKey</code> 格式。
					这是一种以<code>EOS</code>为前缀的公钥形式。 
                    如果您的私钥与新的公钥匹配，此表单将自动验证您的私钥。
                  </p>) : null
                }
                <hr />
                <p className="mb-0">
                  您的私钥将保存在本地浏览器中。但是，请确保永远不要将您的私钥分享给任何人。如果有人向您索要私钥，请不要给他们。私钥是非常敏感的信息，应尽可能保密。
                </p>
              </InfoDivStyled>
              <Form onSubmit={
                handleSubmit
              }>
              <FormGroup row>
                  <Label htmlFor="accountName" sm={2}>账户名称</Label>
                  <Col sm={10}>
                    <InputStyled type="text"
                      name="accountName"
                      id="accountName"
                      defaultValue={keysData[0].account || "Unknown"}
                      readOnly
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label htmlFor="permissionName" sm={2}>权限</Label>
                  <Col sm={10}>
                    <InputStyled type="text"
                      name="permissionName"
                      id="permissionName"
                      defaultValue={keysData[0].permission || "Unknown"}
                      readOnly
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label htmlFor="publicKey" sm={2}>公钥</Label>
                  <Col sm={10}>
                    <InputStyled type="text"
                      name="publicKey"
                      id="publicKey"
                      defaultValue={ keysData[0].public_key }
                      placeholder="输入公钥"
                      onChange={handleChange}
                      invalid={!!errors.publicKey}
                      readOnly={panel === 'import-account-importer'}
                      required={panel === 'import-account-edit'}
                    />
                    {
                      errors.publicKey &&
                      <FormFeedback invalid="true">
                        {errors.publicKey}
                      </FormFeedback>
                    }
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label htmlFor="privateKey" sm={2}>私钥</Label>
                  <Col sm={10}>
                    <InputStyled type="text"
                      name="privateKey"
                      id="privateKey"
                      defaultValue={ keysData[0].private_key }
                      placeholder="输入私钥"
                      onChange={handleChange}
                      invalid={!!errors.privateKey}
                      required
                    />
                    {
                      errors.privateKey &&
                      <FormFeedback invalid="true">
                        {errors.privateKey}
                      </FormFeedback>
                    }
                  </Col>
                </FormGroup>               
                <FormGroup row>
                  <Col sm={8}>

                  </Col>
                  <Col sm={4} clearfix="true">
                    <ButtonGroupSeperated className="float-right" >
                      <ButtonSecondary onClick={()=>{panelSelect("permission-list")}}
                        >
                        后退
                      </ButtonSecondary>
                      <ButtonPrimary className="float-right"
                        disabled={!(values.privateKey)}
                        block>
                        {panel === 'import-account-edit' ? "Edit" : "Import"}
                      </ButtonPrimary>
                    </ButtonGroupSeperated>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </FirstCardStyled>
        </>
      </div>
    </div>
  )

}

export default connect(
  ({ permission, permissionPage: { panel } }) => ({
    permission, panel
  }),
  {
    accountAdd,
    accountEdit,
    panelSelect
  }
)(ImportAccount);
