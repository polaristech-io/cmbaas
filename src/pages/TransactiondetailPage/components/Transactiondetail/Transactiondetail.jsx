import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'
import { fetchStart, paramsSet } from './TransactiondetailReducer';
import isObjectEmpty from 'helpers/is-object-empty';
import pathNameConsumer from 'helpers/pathname-consumer';
import { CardBody, Col, Row, Form, FormGroup} from 'reactstrap';
import styled from 'styled-components';
import { CodeViewer, LoadingSpinner } from 'components';
import { Link } from 'react-router-dom';
import { CardStyled, CardHeaderStyled, TableStyled, ErrorButton, ErrorDivStyled, ButtonPrimary } from 'styled';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

const CustomTable = styled(TableStyled)`
  thead tr{
    background-color: #ffffff;
  }
`

const Transactiondetail = (props) => {

  useEffect(()=>{
    let { router: { location: {pathname} } } = props;
    props.paramsSet({id: pathNameConsumer(pathname)});
    props.fetchStart();
  }, [])

  let { transactiondetail: { isFetching, data, params } } = props;
  let { payload, error } = data;
  
  return (
    <div className="Transactiondetail">
      <div>{ error
              ? 
                <>
                  {!isObjectEmpty(error) && <p className="text-danger">{JSON.stringify(error)}</p>}
                  <ErrorButton onClick={props.fetchStart}>连接错误，点击重新加载</ErrorButton>
                </>
              : isFetching           
                ? <LoadingSpinner />
                : payload.length > 0 
                  ? <div>
                      <Row>
                        <Col sm="12">
                          <FirstCardStyled>
                            <CardHeaderStyled>交易详情</CardHeaderStyled>
                            <CardBody>                              
                              <Form>
                                <FormGroup row>
                                  <Col sm={2}>交易ID:</Col>
                                  <Col sm={10} className="hashText">
                                    {payload[0].id}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Col sm={2}>区块编号:</Col>
                                  <Col sm={10} className="hashText">
                                    <Link to={`/block/${payload[0].block_num}`}>{payload[0].block_num}</Link>
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Col sm={2}>时间:</Col>
                                  <Col sm={10} className="hashText">
                                    {payload[0].partial_expiration}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Col sm={2}>操作数量:</Col>
                                  <Col sm={10} className="hashText">
                                    {payload[0].transaction.actions.length}
                                  </Col>
                                </FormGroup>
                              </Form>
                            </CardBody>
                          </FirstCardStyled>
                        </Col>
                      </Row>

                      {(payload[0].transaction.actions.length) > 0
                        && <Row>
                            <Col sm={12}>
                              <CardStyled>
                                <CardHeaderStyled>操作列表</CardHeaderStyled>
                                <CardBody>                                 
                                  <CustomTable borderless>
                                  <thead>
                                    <tr>
                                      <th width="16%">序号</th>
                                      <th width="34%">操作名称</th>   
                                      <th width="40%">Smart协议名称</th>
                                    </tr>
                                  </thead>
                                  <tbody className="hashText">
                                    {(payload[0].transaction.actions).map((eachAction,index)=>
                                      <tr key={index} onClick={evt=> props.push(`/action/${payload[0].id}/${index+1}`)}>
                                        <td>{index+1}</td>
                                        <td>{eachAction.name}</td>  
                                        <td>{eachAction.account}</td>                                    
                                      </tr>)}
                                  </tbody>
                                  </CustomTable> 
                                </CardBody>
                              </CardStyled>
                            </Col>
                          </Row>
                      }

                      <Row>
                        <Col sm={12}>
                          <CardStyled>
                            <CardHeaderStyled>交易原始JSON</CardHeaderStyled>
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
                  : <CardStyled>
                      <CardHeaderStyled></CardHeaderStyled>
                      <CardBody>
                        <ErrorDivStyled>未找到交易ID为{params.id}的交易 <br/><br/>
                          <ButtonPrimary
                            onClick={evt=> props.push(`/transaction-list`)}>Back
                          </ButtonPrimary>           
                        </ErrorDivStyled>           
                      </CardBody>
                    </CardStyled>
            }
      </div>
    </div>
  );
}

export default connect(
  ({ transactiondetailPage: { transactiondetail }, router}) => ({
    transactiondetail,
    router
  }),
  {
    fetchStart,
    paramsSet,
    push
  }

)(Transactiondetail);
