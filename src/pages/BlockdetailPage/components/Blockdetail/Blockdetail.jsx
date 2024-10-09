import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'
import { fetchStart, paramsSet } from './BlockdetailReducer';
import pathNameConsumer from 'helpers/pathname-consumer';
import isObjectEmpty from 'helpers/is-object-empty';
import { CardBody, Col, Row, Form, FormGroup} from 'reactstrap';
import styled from 'styled-components';
import { CodeViewer, LoadingSpinner } from 'components';
import { CardStyled, CardHeaderStyled, TableStyled, ErrorDivStyled, ButtonPrimary, ErrorButton} from 'styled';


const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`
const CustomTable = styled(TableStyled)`
  thead tr{
    background-color: #ffffff;
  }
`
const Blockdetail = (props) => {

  useEffect(()=>{
    let { router: { location: {pathname} } } = props;
    props.paramsSet({id_or_num: pathNameConsumer(pathname)});
    props.fetchStart();
  }, [])

  let { blockdetail: { isFetching, data, params } } = props;
  let { payload, error } = data;
  
  return (
    <div className="Blockdetail">
      <div>{ error ? 
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
                            <CardHeaderStyled>区块详细</CardHeaderStyled>
                            <CardBody>
                              <Form> 
                                <FormGroup row>
                                  <Col sm={2}>区块编号:</Col>
                                  <Col sm={10} className="hashText">
                                    {payload[0].block_num}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Col sm={2}>区块ID:</Col>
                                  <Col sm={10} className="hashText">
                                    {payload[0].block_id}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Col sm={2}>创建时间:</Col>
                                  <Col sm={10} className="hashText">
                                    {payload[0].timestamp}
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Col sm={2}>交易数量:</Col>
                                  <Col sm={10} className="hashText">
                                    {payload[0].transactions.length}
                                  </Col>
                                </FormGroup>
                              </Form>
                            </CardBody>
                          </FirstCardStyled>
                        </Col>
                      </Row>

                      {(payload[0].transactions).length > 0 &&
                        <Row>
                          <Col sm="12">
                            <CardStyled>
                              <CardHeaderStyled>交易列表</CardHeaderStyled>
                              <CardBody>
                                <CustomTable borderless>
                                <thead>
                                  <tr>
                                    <th width="16%">指数</th>
                                    <th width="84%">交易ID</th>                                    
                                  </tr>
                                </thead>
                                <tbody className="hashText">
                                  {(payload[0].transactions).map((eachTransaction,index)=>
                                    <tr key={index} 
                                        onClick={evt=> props.push(`/transaction/${eachTransaction.trx.id}`)}>
                                      <td>{index+1}</td>
                                      <td>{eachTransaction.trx.id}</td>                                      
                                    </tr>)}
                                </tbody>
                                </CustomTable>                               
                              </CardBody>
                            </CardStyled>
                          </Col>
                        </Row>
                      }  
                      <Row>
                        <Col sm="12">
                          <CardStyled>
                            <CardHeaderStyled>区块原始JSON</CardHeaderStyled>
                            <CardBody>
                              <CodeViewer
                                language="json"
                                value={JSON.stringify(payload[0], null, 2)}
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
                        <ErrorDivStyled>未找到具有区块ID或区块编号 {params.id_or_num} 的区块<br/><br/>
                          <ButtonPrimary
                            onClick={evt=> props.push(`/block-list`)}>Back
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
  ({ blockdetailPage: { blockdetail }, router}) => ({
    blockdetail,
    router
  }),
  {
    fetchStart,
    paramsSet,
    push
  }

)(Blockdetail);
