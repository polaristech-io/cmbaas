import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStart, paramsSet } from './AccountdetailReducer';
import pathNameConsumer from 'helpers/pathname-consumer';
import { push } from 'connected-react-router'

import { CardBody, Col, Row, Form, FormGroup } from 'reactstrap';
import styled from 'styled-components';
import { CodeViewer, LoadingSpinner } from 'components';
import { CardStyled, CardHeaderStyled, ButtonPrimary, InputStyled, ErrorDivStyled } from 'styled';


const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`
const SearchInputStyled = styled(InputStyled)`
  width: 38%;
  margin-right: 10px;
`
const DivFlexStyled = styled.div`
  display: flex;
  justify-content: flex-end;
`
const CustomErrorDiv = styled(ErrorDivStyled)`
  padding: 30px 0 0 0;
`
const Accountdetail = (props) => {

  const [inputValue, setInputValue] = useState("");
  const [showDetailsSection, setShowDetailsSection ] = useState(false);

  useEffect(()=>{
    let { router: { location: {pathname} } } = props;
    if(pathname === '/account' || pathname === '/account/'){
      setShowDetailsSection(false);
    }else{
      setShowDetailsSection(true)
      props.paramsSet({account_name: pathNameConsumer(pathname) });
      props.fetchStart();
    }
  }, [])

  let { accountdetail: { isFetching, data, contractData, params } } = props;
  let { payload={}, error } = data;
  let { contractPayload = {} } = contractData;

  return (
    <div className="Accountdetail">
    <Row>
      <Col sm="12">
        <FirstCardStyled> 
          <CardHeaderStyled>搜索账户</CardHeaderStyled>
          <CardBody>         
            <DivFlexStyled>
              <SearchInputStyled 
                placeholder="账户名称"
                value={inputValue}
                onKeyDown={
                  evt => {
                    if (evt.key === 'Enter') {
                      setInputValue("")
                      if(inputValue !== "")
                        props.push('/account/'+inputValue)
                    }
                  }
                }
                onChange={evt=>{setInputValue(evt.target.value)}}/>
              <ButtonPrimary                   
                onClick={evt=> {
                  setInputValue("")
                  if(inputValue !== "")
                    props.push('/account/'+inputValue)
                }}>
              搜索</ButtonPrimary>
            </DivFlexStyled>            
          </CardBody>
        </FirstCardStyled>
      </Col>
    </Row>
      <div>
        { showDetailsSection &&
          <div>                     
           {error
            ? <CustomErrorDiv>未找到具有账户名称的账户 {params.account_name}</CustomErrorDiv>
            : isFetching
              ? <LoadingSpinner />
              : (Object.keys(payload).length === 0 && payload.constructor === Object) 
                ? <LoadingSpinner />
                : <div>
                    <Row>
                      <Col sm="12">
                        <CardStyled> 
                          <CardHeaderStyled>账户详情</CardHeaderStyled>
                          <CardBody>  
                            <Form> 
                              <FormGroup row>
                                <Col sm={2}>账户名称:</Col>
                                <Col sm={10} className="hashText">
                                  {payload.account_name}
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Col sm={2}>账户创建日期:</Col>
                                <Col sm={10} className="hashText">
                                  {payload.created}
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Col sm={2}>所有者公钥:</Col>
                                <Col sm={10} className="hashText">                                            
                                  {payload.permissions && 
                                    payload.permissions[0].perm_name === "owner"
                                    ? payload.permissions[0].required_auth.keys.length > 0
                                      ? payload.permissions[0].required_auth.keys[0].key 
                                      : "暂无公钥"
                                    : payload.permissions && payload.permissions[1].required_auth.keys.length > 0
                                      ? payload.permissions[1].required_auth.keys[0].key
                                      : "暂无公钥"
                                  }
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Col sm={2}>活动公钥:</Col>
                                <Col sm={10} className="hashText">
                                  {payload.permissions &&
                                    payload.permissions[0].perm_name === "active"
                                    ? payload.permissions[0].required_auth.keys.length > 0
                                      ? payload.permissions[0].required_auth.keys[0].key 
                                      : "暂无公钥"
                                    : payload.permissions && payload.permissions[1].required_auth.keys.length > 0 
                                      ? payload.permissions[1].required_auth.keys[0].key
                                      : "暂无公钥"
                                  }
                                </Col>
                              </FormGroup>
                              { (contractPayload.hasOwnProperty("abi") === false)
                                ? <FormGroup row>
                                    <Col sm={2}>Smart协议:</Col>
                                    <Col sm={10} className="hashText">暂无Smart协议 </Col>
                                  </FormGroup> 
                                : <FormGroup row>
                                    <Col sm={2}>Smart协议:</Col>
                                    <Col sm={10} className="hashText">
                                      <Link to={`/contract/${contractPayload.account_name}`}>
                                        {contractPayload.account_name}
                                      </Link>                                      
                                    </Col>
                                  </FormGroup>     
                              }                                                          
                            </Form>
                          </CardBody>
                        </CardStyled>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="12">
                        <CardStyled>
                          <CardHeaderStyled>账户原始JSON</CardHeaderStyled>
                          <CardBody>
                            <CodeViewer
                              language="json"
                              value={JSON.stringify(payload, null, 2)}
                              readOnly={true}
                              height={600}
                            />
                          </CardBody>
                        </CardStyled>                       
                      </Col>  
                    </Row>        
                  </div> 
            }
          </div>
        }                                         
      </div>
    </div>
  );
}

export default connect(
  ({ accountdetailPage: { accountdetail }, router}) => ({
    accountdetail,
    router
  }),
  {
    fetchStart,
    paramsSet,
    push
  }

)(Accountdetail);
