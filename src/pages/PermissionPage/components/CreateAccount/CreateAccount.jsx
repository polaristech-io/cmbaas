import React, { useEffect }  from 'react';
import {
  Button, Form, FormGroup, Label, FormFeedback, FormText,
  Spinner, Col, UncontrolledAlert, CardBody
} from 'reactstrap';
import cogoToast from 'cogo-toast';

import { connect } from 'react-redux';

import { fetchStart } from './CreateAccountReducer';
import { createStart } from 'reducers/permission';
import { panelSelect } from 'pages/PermissionPage/PermissionPageReducer';
import useForm from 'helpers/useForm';
import validate from './CreateAccountValidatorEngine/CreateAccountValidatorEngine';
import { CardStyled, OverlayStyled, CardHeaderStyled, ButtonPrimary, ButtonSecondary, InputStyled, ButtonGroupSeperated } from 'styled';
import styled from 'styled-components';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

const CreateAccount = (props) => {

  const { values, handleChange, handleSubmit, errors } = useForm(createAccount, validate);

  useEffect(()=>{
    props.fetchStart();
  }, [])

  let { 
    createAccount: { isFetching, data, }, 
    permission, panelSelect
  } = props;
  let { payload, error } = data;
  let { 
    data: { submitError, isSubmitting, creationSuccess }
  } = permission;

  function createAccount () {
    let msg = `无法创建名为“eosio”的账户，因为“eosio”拥有用于创建新账户的系统协议。`
    if (values.accountName !== 'eosio')
      props.createStart({
        accountName: values.accountName,
        ownerPrivateKey: payload.ownerPrivateKey,
        ownerPublicKey: payload.ownerPublicKey,
        activePrivateKey: payload.activePrivateKey,
        activePublicKey: payload.activePublicKey
      });
    else 
      cogoToast.error(msg, {
        heading: '账户创建被拒绝',
        position: 'bottom-center',
        hideAfter: 2
      });
    window.scrollTo(0, 0);  
  }

  return (
    <div className="CreateAccount">
      <div>
        { 
          error         ? <Button onClick={props.fetchStart}>重试生成</Button>
          : <>
              <FirstCardStyled>
                <OverlayStyled isLoading={isFetching || isSubmitting}></OverlayStyled>
                {
                    (isSubmitting || isFetching) &&
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
                  创建账户
                </CardHeaderStyled>
                <CardBody>
                  {
                    creationSuccess &&
                      <UncontrolledAlert color="success">
                        账户 {values.accountName} 已经成功创建
                      </UncontrolledAlert>
                  }
                  {
                    ((!creationSuccess) && submitError) ?
                        <UncontrolledAlert color="danger"> 
                          创建账户时出错: {submitError}
                        </UncontrolledAlert>
                      : null
                  }
                  <Form onSubmit={
                    处理提交
                  }>
                    <FormGroup row>
                      <Label htmlFor="accountName" sm={2}>账户名称</Label>
                      <Col sm={10}>
                        <InputStyled type="text"
                          name="accountName"
                          id="accountName"
                          placeholder="您的账户名"
                          value={values.accountName || ''}
                          onChange={handleChange}
                          invalid={!!errors.accountName}
                          readOnly={creationSuccess}
                          required
                          />
                        {
                          errors.accountName && 
                          <FormFeedback invalid="true">
                            {errors.accountName}
                          </FormFeedback>
                        }
                        <FormText>
                          <strong>EOSIO 账户名不能包含大写字母。
                          它也不能包含数字 0、6、7、8 或 9。您可以使用的唯一特殊字符是 '.'</strong>
                        </FormText>
                      </Col>
                    </FormGroup>
                    <div><b>所有者</b></div>
                    <FormGroup row>
                      <Label htmlFor="ownerPublic" sm={2}>公钥</Label>
                      <Col sm={10}>
                        <InputStyled type="text"
                          name="ownerPublic"
                          id="ownerPublic"
                          placeholder="生成密钥..."
                          value={
                            values.ownerPublic 
                            || payload.ownerPublicKey
                          }
                          onInput={handleChange}
                          readOnly
                          />
                      </Col> 
                    </FormGroup>
                    <FormGroup row>
                      <Label htmlFor="ownerPrivate" sm={2}>私钥</Label>
                      <Col sm={10}>
                        <InputStyled type="text"
                            name="ownerPrivate"
                            id="ownerPrivate"
                            placeholder="生成密钥..."
                            value={
                              values.ownerPrivate
                              || payload.ownerPrivateKey
                            }
                            onInput={handleChange}
                            readOnly
                            />
                      </Col>
                    </FormGroup>
                    <div><b>激活</b></div>
                    <FormGroup row>
                      <Label htmlFor="activePublic" sm={2}>公钥</Label>
                      <Col sm={10}>
                        <InputStyled type="text"
                          name="activePublic"
                          id="activePublic"
                          placeholder="生成密钥..."
                          value={
                            values.activePublic
                            || payload.activePublicKey
                          }
                          onInput={handleChange}
                          readOnly
                          />
                      </Col> 
                    </FormGroup>
                    <FormGroup row>
                      <Label htmlFor="activePrivate" sm={2}>私钥</Label>
                      <Col sm={10}>
                        <InputStyled type="text"
                            name="activePrivate"
                            id="activePrivate"
                            placeholder="生成密钥..."
                            value={
                              values.activePrivate
                              || payload.activePrivateKey
                            }
                            onInput={handleChange}
                            readOnly
                            />
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
                          <ButtonPrimary
                            disabled={!values.accountName || isSubmitting || creationSuccess}
                            block
                            >
                            创建
                          </ButtonPrimary>
                        </ButtonGroupSeperated>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </FirstCardStyled>
              
              
            </>
        }
      </div>
    </div>
  )

}

export default connect(
  ({ permissionPage: { createAccount }, permission}) => ({
    createAccount, permission
  }),
  {
    fetchStart,
    createStart,
    panelSelect
  }

)(CreateAccount);
