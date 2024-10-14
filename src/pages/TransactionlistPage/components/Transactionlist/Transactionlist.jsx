import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'
import { pollingStart, pollingStop, recordsUpdate } from './TransactionlistReducer';
import { Row, Col, CardTitle, CardBody } from 'reactstrap';
import styled from 'styled-components';
import isObjectEmpty from 'helpers/is-object-empty';
import { LimitSelectDropdown, LoadingSpinner } from 'components';
import { CardStyled, CardHeaderStyled, TableStyled, ButtonPrimary, ErrorButton, InputStyled } from 'styled';


const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

const DivFlexStyled = styled.div`
  display: flex;
  justify-content: flex-end;
`
const SearchInputStyled = styled(InputStyled)`
  width: 38%;
  margin-right: 10px;
`

const Transactionlist = (props) => {

  useEffect(()=>{
    props.pollingStart()
    return () => { props.pollingStop() }
  }, [])

  const [inputValue, setInputValue] = useState("");

  let { transactionlist: { isPolling, data, records } } = props;
  let { payload = [], error } = data;

  return (
    <div className="Transactionlist">
      <FirstCardStyled>
        <CardHeaderStyled>交易列表</CardHeaderStyled>
        <CardBody>
          <CardTitle>
            <DivFlexStyled>
              <SearchInputStyled
                    placeholder="交易ID"
                    value={inputValue}
                    onKeyDown={
                      evt => {
                        if (evt.key === 'Enter') {
                          setInputValue("");
                          if(inputValue !== "")
                            props.push('/transaction/'+inputValue)
                        }
                      }
                    }
                    onChange={evt=>{setInputValue(evt.target.value)}}/>
              <ButtonPrimary
                    onClick={evt=> {
                      setInputValue("");
                      if(inputValue !== "")
                        props.push('/transaction/'+inputValue)
                    }}>
              搜索</ButtonPrimary>
            </DivFlexStyled>
          </CardTitle>

          <div>{error
              ?
                <>
                  {!isObjectEmpty(error) && <p className="text-danger">{JSON.stringify(error)}</p>}
                  <ErrorButton onClick={props.pollingStart}>连接错误，点击重新加载</ErrorButton>
                </>
                :
                  <Row>
                    <Col xs="12">
                      <TableStyled borderless>
                        <thead>
                          <tr>
                            <th width="50%">交易ID</th>
                            <th width="20%">区块编号</th>
                            <th width="30%">时间</th>
                          </tr>
                        </thead>
                        <tbody className="hashText">
                          {(isPolling) 
                          ? <tr><td colSpan="3" className="text-center"><LoadingSpinner /></td></tr>
                          : (payload.length < 1)
                            ? <tr><td colSpan="3" className="text-center">暂无交易</td></tr>
                            : payload.map((eachTransaction, index)=>
                            <tr onClick={evt=>props.push(`/transaction/${eachTransaction.id}`)} key={index}>
                              <td>{eachTransaction.id}</td>
                              <td>{eachTransaction.block_num}</td>
                              <td>{eachTransaction.partial_expiration}</td>
                            </tr>)}
                        </tbody>
                      </TableStyled>
                    </Col>
                    {payload.length > 0 &&
                      <Col xs="12" className="text-right">
                        <LimitSelectDropdown limit={records} onChange={(limit) => { props.recordsUpdate(limit) }} />
                      </Col>
                    }
                  </Row>
                }
          </div>
        </CardBody>
      </FirstCardStyled>
    </div>
  );
}

export default connect(
  ({ transactionlistPage: { transactionlist }}) => ({
    transactionlist
  }),
  {
    pollingStart,
    pollingStop,
    recordsUpdate,
    push
  }

)(Transactionlist);
