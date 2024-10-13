import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { Row, Col, CardTitle, Form } from 'reactstrap';
import styled from 'styled-components';
import { push } from 'connected-react-router'
import { fetchStart, smartContractNameSearch, recordsUpdate } from './ActionlistReducer';
import { LoadingSpinner, LimitSelectDropdown } from 'components';
import isObjectEmpty from 'helpers/is-object-empty';
import { TableStyled, ButtonPrimary, InputStyled, ErrorButton } from 'styled';

const FormStyled = styled(Form)`
  display: flex;
  justify-content: flex-end;
`
const FilterInputStyled = styled(InputStyled)`
  width: 38%;
  margin-right: 10px;
`

const Actionlist = (props) => {

  useEffect(()=>{
    props.fetchStart();
    return () => { }
  }, [])

  const [inputValue, setInputValue] = useState("");
  let { actionlist: { isFetching, data, smartContractName, records } } = props;
  let { payload = [], error } = data;

  return (
    <div className="Actionlist">
      <Row>
        <Col xs="12" className="text-right">
          <CardTitle>
            <FormStyled onSubmit={(e) => {
                e.preventDefault();
                if(smartContractName) {
                  props.smartContractNameSearch("");
                  setInputValue("");
                  e.target.smartContractNameSearch.value = "";
                } else {
                  props.smartContractNameSearch(inputValue);
                  setInputValue(inputValue);
                }
              }}>
              <FilterInputStyled
                  disabled={!!smartContractName}
                  name="smartContractNameSearch"
                  placeholder="Smart协议名称..."
                  defaultValue={smartContractName}
                  onChange={evt=>{setInputValue(evt.target.value)}}/>
              <ButtonPrimary color="primary">{smartContractName ? "清除" : "过滤"}</ButtonPrimary>
            </FormStyled>
          </CardTitle>
        </Col>
      </Row>
      <Row>
        <Col xs="12">
        { (error && error.status.name !== "AjaxTimeoutError") ?
          <>
            {!isObjectEmpty(error) && <p className="text-danger">{JSON.stringify(error.status.message)}</p>}
            <ErrorButton onClick={props.fetchStart}>连接错误，点击重新加载</ErrorButton>
          </>
        : isFetching ? (
          <LoadingSpinner />
        ) : (
          <Row>
            <Col xs="12">
              <TableStyled borderless>
                <thead>
                  <tr>
                    <th width="33%">Smart协议名称</th>
                    <th width="33%">操作类型</th>
                    <th width="34%">时间</th>
                  </tr>
                </thead>
                <tbody className="hashText">
                  {payload.length < 1
                    ? <tr><td colSpan="3" className="text-center">未找到操作{smartContractName && ` Smart协议名称为 ${smartContractName}`}</td></tr>
                    : payload.map((action, index)=>
                      <tr onClick={evt=>props.push(`/action/${action.transaction_id}/${action.action_ordinal}`)} key={index}>
                        <td>{action.act_account}</td>
                        <td>{action.act_name}</td>
                        <td>{action.timestamp}</td>
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
        )}
        </Col>
      </Row>
    </div>
  );
}

export default connect(
  ({ actionlistPage: { actionlist }}) => ({
    actionlist
  }),
  {
    fetchStart,
    smartContractNameSearch,
    recordsUpdate,
    push
  }

)(Actionlist);
