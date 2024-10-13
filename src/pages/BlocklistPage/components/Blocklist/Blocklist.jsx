import React, { useEffect, useState } from 'react';
import { CardBody, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { push } from 'connected-react-router'
import styled from 'styled-components';
import isObjectEmpty from 'helpers/is-object-empty';
import { LoadingSpinner, LimitSelectDropdown } from 'components';
import { CardStyled,CardHeaderStyled, TableStyled, ButtonPrimary, ErrorButton, CheckBoxDivStyled, InputStyled } from 'styled';

import { pollingStart, pollingStop, filterToggle, recordsUpdate } from './BlocklistReducer';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`
const SearchInputStyled = styled(InputStyled)`
  width: 65%;
  margin-right: 10px;
`
const DivFlexStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 20px;
`

const Blocklist = (props) => {

  useEffect(()=>{
    props.pollingStart()
    return () => { props.pollingStop() }
  }, [])

  const [inputValue, setInputValue] = useState("");

  let { blocklist: { isPolling, data, filter, records } } = props;
  let { payload = [], error } = data;

  return (
    <div className="Blocklist">
      <FirstCardStyled>
        <CardHeaderStyled>区块列表</CardHeaderStyled>
        <CardBody>
          <Row>
            <Col sm="5">
              <CheckBoxDivStyled>
                <label className="checkboxContainer">暂无区块
                  <input onChange={props.filterToggle} type="checkbox" checked={filter} />
                  <span className="checkmark"></span>
                </label>
              </CheckBoxDivStyled>

            </Col>
            <Col sm="7">
              <DivFlexStyled>
                <SearchInputStyled
                      placeholder="区块编号 / 区块ID"
                      value={inputValue}
                      onKeyDown={
                        evt => {
                          if (evt.key === 'Enter') {
                            setInputValue("");
                            if(inputValue !== "")
                              props.push('/block/'+inputValue)
                          }
                        }
                      }
                      onChange={evt=>{setInputValue(evt.target.value)}}/>
                <ButtonPrimary
                      onClick={evt=> {
                        setInputValue("");
                        if(inputValue !== "")
                          props.push('/block/'+inputValue)
                      }}>
                搜索</ButtonPrimary>
                </DivFlexStyled>
            </Col>
          </Row>
          <div>
            { error
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
                            <th width="15%">区块编号</th>
                            <th width="45%">区块ID</th>
                            <th width="20%">交易数量</th>
                            <th width="20%">时间</th>
                          </tr>
                        </thead>
                        <tbody className="hashText">
                          {(isPolling || payload.length <= 0) ? (
                            <tr><td colSpan="4" className="text-center"><LoadingSpinner /></td></tr>
                          ) : payload.map(eachBlock=>
                            <tr onClick={evt=>props.push(`/block/${eachBlock.block_num}`)} key={eachBlock.block_num}>
                              <td>{eachBlock.block_num}</td>
                              <td>{eachBlock.block_id}</td>
                              <td>{eachBlock.transaction_count}</td>
                              <td>{eachBlock.timestamp}</td>
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
  ({ blocklistPage: { blocklist }}) => ({
    blocklist
  }),
  {
    pollingStart,
    pollingStop,
    filterToggle,
    recordsUpdate,
    push
  }

)(Blocklist);
